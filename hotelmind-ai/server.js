import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0';
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.wasm': 'application/wasm',
};

const server = http.createServer((req, res) => {
  // Normalize URL and remove query strings / hash
  const urlPath = req.url ? req.url.split('?')[0] : '/';
  let safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
  
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  let filePath = path.join(DIST_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    // If file exists and is a file, serve it directly
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      // Set caching headers for static assets
      if (filePath.includes(path.join('dist', 'assets'))) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      }

      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // SPA Fallback: for any non-asset route, serve dist/index.html (e.g. /dashboard, /guest-portal)
    const indexPath = path.join(DIST_DIR, 'index.html');
    fs.readFile(indexPath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error: dist/index.html not found. Please run "npm run build" first.');
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      });
      res.end(content);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[HotelMind AI] Production server running at http://${HOST}:${PORT}`);
  console.log(`[HotelMind AI] Serving static files from: ${DIST_DIR}`);
});
