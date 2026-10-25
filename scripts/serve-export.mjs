import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

// Local-only preview of the same exported files GitHub Pages serves.
const root = path.resolve('out');
const port = Number(process.env.PORT || 3001);
const mime = {
  '.html': 'text/html; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};
const server = createServer(async (req, res) => {
  try {
    const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const base = path.resolve(root, `.${requested}`);
    if (base !== root && !base.startsWith(root + path.sep)) {
      res.writeHead(403).end(); return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' }).end(); return;
    }
    const candidates = requested.endsWith('/') ? [path.join(base, 'index.html')] : [base, `${base}.html`, path.join(base, 'index.html')];
    let file;
    for (const candidate of candidates) {
      if (await stat(candidate).then((s) => s.isFile()).catch(() => false)) { file = candidate; break; }
    }
    if (!file) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : await readFile(path.join(root, '404.html')).catch(() => 'Not found')); return;
    }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : await readFile(file));
  } catch {
    res.writeHead(400).end('Bad request');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Static export preview: http://127.0.0.1:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
