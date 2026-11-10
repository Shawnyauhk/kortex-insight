import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.ico':'image/x-icon' };
const routes = new Set(['/','/insights','/briefings','/research','/assistant','/solutions','/en','/en/insights','/en/briefings','/en/research','/en/assistant','/en/solutions']);
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);
  const staticPath = pathname === '/' ? '/index.html' : pathname === '/manus-routes.json' ? '/public/manus-routes.json' : pathname;
  let file = normalize(join(root, staticPath));
  const permitted = file === join(root, 'index.html') || file.startsWith(join(root, 'src') + '/') || file.startsWith(join(root, 'public') + '/');
  if (!permitted && !routes.has(pathname)) { res.writeHead(404); res.end('Not found'); return; }
  if (!permitted) file = join(root, 'index.html');
  try {
    const info = await stat(file);
    if (info.isDirectory()) file = join(file, 'index.html');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'X-Content-Type-Options':'nosniff', 'Cache-Control':'no-cache' });
    res.end(data);
  } catch {
    if (routes.has(pathname) || !extname(pathname)) {
      try { res.writeHead(200, { 'Content-Type':mime['.html'], 'Cache-Control':'no-cache' }); res.end(await readFile(join(root,'index.html'))); }
      catch { res.writeHead(500); res.end('Application entry point unavailable'); }
    } else { res.writeHead(404); res.end('Not found'); }
  }
});
server.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log(`Legalhub frontend listening on ${process.env.PORT || 3000}`));
