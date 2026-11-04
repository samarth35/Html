import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const distDir = path.join(rootDir, 'dist');
const distAssetsDir = path.join(distDir, 'assets');
const jainzeeStaticAssetsDir = path.join(rootDir, 'jainzee-website', 'static', 'assets');
const jainzeeTemplateIndex = path.join(rootDir, 'jainzee-website', 'templates', 'index.html');
const distIndex = path.join(distDir, 'index.html');

console.log('[SYNC] Starting build sync...');

if (!fs.existsSync(distDir) || !fs.existsSync(distIndex)) {
  console.error('[SYNC ERROR] dist directory or dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

// 1. Ensure target static/assets directory exists
if (!fs.existsSync(jainzeeStaticAssetsDir)) {
  fs.mkdirSync(jainzeeStaticAssetsDir, { recursive: true });
}

// 2. Copy all generated assets to jainzee-website/static/assets
if (fs.existsSync(distAssetsDir)) {
  const assetFiles = fs.readdirSync(distAssetsDir);
  for (const file of assetFiles) {
    const srcFile = path.join(distAssetsDir, file);
    const destFile = path.join(jainzeeStaticAssetsDir, file);
    const stat = fs.statSync(srcFile);
    if (stat.isDirectory()) {
      fs.cpSync(srcFile, destFile, { recursive: true });
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
    console.log(`[SYNC] Copied asset: ${file} -> jainzee-website/static/assets/`);
  }
}

// 3. Copy dist/index.html to jainzee-website/templates/index.html
fs.copyFileSync(distIndex, jainzeeTemplateIndex);
console.log('[SYNC] Updated jainzee-website/templates/index.html from dist/index.html');

// 4. Ensure robots.txt & sitemap.xml are synced
const publicRobots = path.join(rootDir, 'public', 'robots.txt');
const publicSitemap = path.join(rootDir, 'public', 'sitemap.xml');
const staticRobots = path.join(rootDir, 'jainzee-website', 'static', 'robots.txt');
const staticSitemap = path.join(rootDir, 'jainzee-website', 'static', 'sitemap.xml');

if (fs.existsSync(publicRobots)) {
  fs.copyFileSync(publicRobots, staticRobots);
  fs.copyFileSync(publicRobots, path.join(distDir, 'robots.txt'));
}
if (fs.existsSync(publicSitemap)) {
  fs.copyFileSync(publicSitemap, staticSitemap);
  fs.copyFileSync(publicSitemap, path.join(distDir, 'sitemap.xml'));
}

// 5. Ensure favicon is synced
const publicFavicon = path.join(rootDir, 'public', 'favicon.ico');
const staticFavicon = path.join(rootDir, 'jainzee-website', 'static', 'favicon.ico');
if (fs.existsSync(publicFavicon)) {
  fs.copyFileSync(publicFavicon, staticFavicon);
  fs.copyFileSync(publicFavicon, path.join(distDir, 'favicon.ico'));
}

console.log('[SYNC COMPLETE] Build artifacts successfully synchronized with Flask backend!');
