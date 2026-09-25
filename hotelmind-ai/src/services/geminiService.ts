// ─── Gemini API Key & Model Rotation Service ──────────────────────────────────
// Automatically rotates API keys on HTTP 429 / Quota Exceeded errors.
// Automatically rotates models if all keys are exhausted on the active model.
// Fast-fails invalid keys and includes timeout to ensure chatbot never freezes.

export interface KeyStatus {
  key: string;
  masked: string;
  index: number;
  status: 'active' | 'ready' | 'quota_exhausted' | 'error';
  lastUsed?: number;
  failureCount: number;
}

export interface RotationEvent {
  id: string;
  timestamp: string;
  type: 'key_rotation' | 'model_rotation' | 'quota_hit' | 'success';
  message: string;
  previousKey?: string;
  newKey?: string;
  previousModel?: string;
  newModel?: string;
}

export interface GeminiTelemetry {
  currentKeyIndex: number;
  currentKeyMasked: string;
  currentModel: string;
  keys: KeyStatus[];
  models: string[];
  totalCalls: number;
  successfulCalls: number;
  rotationEvents: RotationEvent[];
}

// Default keys from environment or provided list
const RAW_KEYS = (
  import.meta.env.VITE_GEMINI_API_KEYS ||
  'AIzaSyAtSNHZustb6NrJJQw-FbigMihes5UgTtU,AIzaSyCeK8rJut5skMSTQuCfc0eip6cVbwG-wZg,AIzaSyB3U63hjXtAVLM012Hbvv8p2pSpV4L6lo0,AIzaSyB5tQHmqazUj3hB9y99SA7CtCouAcoNtn8,AIzaSyD3kmkmribUP88DthwYt-o1Syvcc9m35pM,AIzaSyAcyVQ2JaIB5ko4nej-XFBJE93pJ4ge4KA'
)
  .split(',')
  .map((k: string) => k.trim())
  .filter(Boolean);

const MODELS = (
  import.meta.env.VITE_GEMINI_MODELS ||
  'gemini-2.0-flash,gemini-1.5-flash,gemini-1.5-pro'
)
  .split(',')
  .map((m: string) => m.trim())
  .filter(Boolean);

function maskKey(key: string): string {
  if (!key || key.length < 8) return '****';
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

class GeminiRotationManager {
  private keys: string[] = RAW_KEYS;
  private models: string[] = MODELS;
  private currentKeyIndex = 0;
  private currentModelIndex = 0;
  private failureCounts: Record<string, number> = {};
  private keyStatuses: Record<string, 'active' | 'ready' | 'quota_exhausted' | 'error'> = {};
  private rotationEvents: RotationEvent[] = [];
  private totalCalls = 0;
  private successfulCalls = 0;
  private listeners: Array<() => void> = [];

  constructor() {
    this.keys.forEach((k) => {
      this.keyStatuses[k] = 'ready';
      this.failureCounts[k] = 0;
    });
    if (this.keys.length > 0) {
      this.keyStatuses[this.keys[0]] = 'active';
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private logEvent(event: Omit<RotationEvent, 'id' | 'timestamp'>) {
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const fullEvent: RotationEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: now,
    };
    this.rotationEvents = [fullEvent, ...this.rotationEvents].slice(0, 30);
    this.notify();
  }

  public getTelemetry(): GeminiTelemetry {
    const currentKey = this.keys[this.currentKeyIndex] || '';
    return {
      currentKeyIndex: this.currentKeyIndex,
      currentKeyMasked: maskKey(currentKey),
      currentModel: this.models[this.currentModelIndex] || 'gemini-2.0-flash',
      models: [...this.models],
      keys: this.keys.map((k, idx) => ({
        key: k,
        masked: maskKey(k),
        index: idx,
        status: idx === this.currentKeyIndex ? 'active' : (this.keyStatuses[k] || 'ready'),
        failureCount: this.failureCounts[k] || 0,
      })),
      totalCalls: this.totalCalls,
      successfulCalls: this.successfulCalls,
      rotationEvents: [...this.rotationEvents],
    };
  }

  /**
   * Jump to next key in pool.
   * Returns true if jumped to next key, or false if all keys were exhausted.
   */
  public rotateKey(reason: string = 'Quota exhausted'): boolean {
    const prevKey = this.keys[this.currentKeyIndex];
    if (this.keyStatuses[prevKey] !== 'error') {
      this.keyStatuses[prevKey] = 'quota_exhausted';
    }

    const nextIndex = (this.currentKeyIndex + 1) % this.keys.length;
    const isFullCycle = nextIndex === 0;

    this.currentKeyIndex = nextIndex;
    const newKey = this.keys[this.currentKeyIndex];
    if (this.keyStatuses[newKey] !== 'error') {
      this.keyStatuses[newKey] = 'active';
    }

    this.logEvent({
      type: 'key_rotation',
      message: `Key rotation: ${reason}. Jumped from ${maskKey(prevKey)} (Key #${(nextIndex || this.keys.length)}) to ${maskKey(newKey)} (Key #${nextIndex + 1})`,
      previousKey: maskKey(prevKey),
      newKey: maskKey(newKey),
    });

    return !isFullCycle;
  }

  /**
   * Jump to next model in hierarchy.
   */
  public rotateModel(reason: string = 'All keys exhausted on current model'): void {
    const prevModel = this.models[this.currentModelIndex];
    this.currentModelIndex = (this.currentModelIndex + 1) % this.models.length;
    const newModel = this.models[this.currentModelIndex];

    // Reset non-errored keys to ready
    this.keys.forEach((k) => {
      if (this.keyStatuses[k] !== 'error') {
        this.keyStatuses[k] = 'ready';
      }
    });

    // Find next non-error key
    const availableKeyIndex = this.keys.findIndex((k) => this.keyStatuses[k] !== 'error');
    if (availableKeyIndex !== -1) {
      this.currentKeyIndex = availableKeyIndex;
      this.keyStatuses[this.keys[this.currentKeyIndex]] = 'active';
    }

    this.logEvent({
      type: 'model_rotation',
      message: `Model jump: ${reason}. Shifted from ${prevModel} to ${newModel}`,
      previousModel: prevModel,
      newModel,
    });
  }

  /**
   * Primary method: generates content with automatic Key & Model rotation
   * Features fast timeout and fast-fail for invalid keys to prevent hanging
   */
  public async generateContent(
    prompt: string,
    systemInstruction?: string
  ): Promise<{ text: string; modelUsed: string; keyUsed: string }> {
    this.totalCalls++;

    // Check if all keys are already known to be invalid
    const activeKeysCount = this.keys.filter((k) => this.keyStatuses[k] !== 'error').length;
    if (activeKeysCount === 0 && this.keys.length > 0) {
      throw new Error('All configured API keys are invalid or revoked.');
    }

    const totalPossibleAttempts = Math.min(this.models.length * this.keys.length, 8);
    let attempts = 0;

    while (attempts < totalPossibleAttempts) {
      const currentModel = this.models[this.currentModelIndex];
      const currentKey = this.keys[this.currentKeyIndex];
      attempts++;

      // If current key is marked error, skip immediately
      if (this.keyStatuses[currentKey] === 'error') {
        const hasMore = this.rotateKey('Skipping known invalid key');
        if (!hasMore) {
          const remaining = this.keys.filter((k) => this.keyStatuses[k] !== 'error').length;
          if (remaining === 0) {
            throw new Error('All configured API keys are invalid.');
          }
          this.rotateModel('Rotating model for remaining keys');
        }
        continue;
      }

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${currentKey}`;

        const payload: any = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        };

        if (systemInstruction) {
          payload.systemInstruction = {
            parts: [{ text: systemInstruction }],
          };
        }

        // Fast 3.5s timeout controller so UI never hangs
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const status = res.status;
          const errorJson = await res.json().catch(() => ({}));
          const errorMsg = errorJson?.error?.message || res.statusText || '';
          const lowerMsg = errorMsg.toLowerCase();

          // Handle invalid / revoked keys immediately
          const isInvalidKey =
            status === 400 &&
            (lowerMsg.includes('api key not valid') ||
             lowerMsg.includes('key not valid') ||
             lowerMsg.includes('api_key_invalid') ||
             lowerMsg.includes('bad request'));

          if (isInvalidKey) {
            this.keyStatuses[currentKey] = 'error';
            this.failureCounts[currentKey] = (this.failureCounts[currentKey] || 0) + 1;
            const remaining = this.keys.filter((k) => this.keyStatuses[k] !== 'error').length;

            if (remaining === 0) {
              this.logEvent({
                type: 'quota_hit',
                message: 'All configured Gemini API keys are invalid or revoked. Seamlessly engaging local AI engine.',
              });
              throw new Error('All configured API keys are invalid.');
            }

            this.rotateKey(`Key ${maskKey(currentKey)} reported invalid by Google API`);
            continue;
          }

          // Check if quota/rate limit error (429, 403, or RESOURCE_EXHAUSTED)
          const isQuota =
            status === 429 ||
            status === 403 ||
            lowerMsg.includes('quota') ||
            lowerMsg.includes('resource_exhausted') ||
            lowerMsg.includes('rate');

          const isModelNotFound =
            status === 404 ||
            lowerMsg.includes('not found') ||
            lowerMsg.includes('unsupported');

          this.failureCounts[currentKey] = (this.failureCounts[currentKey] || 0) + 1;

          if (isModelNotFound) {
            this.rotateModel(`Model ${currentModel} returned 404 / unsupported`);
            continue;
          }

          if (isQuota) {
            this.logEvent({
              type: 'quota_hit',
              message: `HTTP ${status} Quota reached on Key ${maskKey(currentKey)} for ${currentModel}`,
            });

            const hasMoreKeys = this.rotateKey(`HTTP ${status} quota reached on ${maskKey(currentKey)}`);
            if (!hasMoreKeys) {
              this.rotateModel(`All keys hit quota limit on ${currentModel}`);
            }
            continue;
          }

          // Other server errors (500, 503) -> try next key
          if (status >= 500) {
            this.rotateKey(`HTTP ${status} server error`);
            continue;
          }

          this.rotateKey(`Client error: ${errorMsg.slice(0, 50)}`);
          continue;
        }

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (!text) {
          throw new Error('Empty candidate response from Gemini');
        }

        this.successfulCalls++;
        this.logEvent({
          type: 'success',
          message: `Generated via ${currentModel} using Key ${maskKey(currentKey)}`,
        });

        return {
          text,
          modelUsed: currentModel,
          keyUsed: maskKey(currentKey),
        };
      } catch (err: any) {
        if (err.message && err.message.includes('All configured API keys are invalid')) {
          throw err;
        }
        // Timeout or fetch error -> rotate key
        this.logEvent({
          type: 'quota_hit',
          message: `Network/timeout on Key ${maskKey(currentKey)}: ${err.name === 'AbortError' ? 'Request timed out (3.5s)' : err.message || 'Error'}`,
        });
        const hasMore = this.rotateKey('Network or timeout exception');
        if (!hasMore) {
          this.rotateModel('Connection timeout across keys');
        }
      }
    }

    throw new Error('All rotating API keys and models exhausted.');
  }
}

export const geminiRotationManager = new GeminiRotationManager();
