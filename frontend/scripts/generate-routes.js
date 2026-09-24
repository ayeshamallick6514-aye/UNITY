import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const routes = [
  'select-role',
  'auth/login',
  'auth/verify',
  'auth/forgot',
  'unauthorized',
  'forbidden',
  'authority',
  'authority/dashboard',
  'authority/projects',
  'authority/map',
  'authority/departments',
  'authority/coordination',
  'authority/approvals',
  'authority/brief',
  'authority/analytics',
  'authority/settings',
  'command',
  'command/overview',
  'command/escalations',
  'command/matrix',
  'command/projects',
  'command/citizens',
  'command/funding',
  'command/reports',
  'command/kpis',
  'command/health',
  'command/ai',
  'citizen',
  'citizen/home',
  'citizen/portal',
  'citizen/report',
  'citizen/projects',
  'citizen/schemes',
  'citizen/track',
  'citizen/notifications',
  'citizen/profile',
];

if (!fs.existsSync(distDir)) {
  console.error('Dist directory does not exist! Run build first.');
  process.exit(1);
}

const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// 1. Create 404.html (for hosts that support 404 fallback like GitHub Pages / Render)
fs.writeFileSync(path.join(distDir, '404.html'), indexHtml, 'utf-8');
console.log('✓ Created dist/404.html');

// 2. Create static directories and index.html / <name>.html for all defined routes
routes.forEach((route) => {
  const routeDir = path.join(distDir, route);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtml, 'utf-8');

  // Also create <route>.html in parent directory
  const htmlFile = path.join(distDir, `${route}.html`);
  const parentDir = path.dirname(htmlFile);
  fs.mkdirSync(parentDir, { recursive: true });
  fs.writeFileSync(htmlFile, indexHtml, 'utf-8');
});

console.log(`✓ Successfully generated static route fallbacks for ${routes.length} application routes.`);
