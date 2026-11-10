import { cp, copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = join(projectRoot, 'dist');
const staticRoutes = [
  '/insights',
  '/briefings',
  '/research',
  '/assistant',
  '/solutions',
  '/en',
  '/en/insights',
  '/en/briefings',
  '/en/research',
  '/en/assistant',
  '/en/solutions'
];

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await copyFile(join(projectRoot, 'index.html'), join(outputDir, 'index.html'));
await cp(join(projectRoot, 'src'), join(outputDir, 'src'), { recursive: true });
await cp(join(projectRoot, 'public'), join(outputDir, 'public'), { recursive: true });
await copyFile(join(projectRoot, 'public', 'manus-routes.json'), join(outputDir, 'manus-routes.json'));

const rewrites = staticRoutes.map(route => `${route} /index.html 200`).join('\n');
await writeFile(join(outputDir, '_redirects'), `${rewrites}\n`, 'utf8');
console.log(`Cloudflare Pages static output created: ${outputDir}`);
