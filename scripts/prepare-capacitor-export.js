#!/usr/bin/env node
/**
 * Post-build step for Capacitor iOS: set vault app as entry point.
 * Next.js static export writes /immortality-vault/app.html — we symlink
 * index.html so the native shell opens the vault dashboard on launch.
 */
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');
const entry = path.join(outDir, 'immortality-vault', 'app.html');
const index = path.join(outDir, 'index.html');
const login = path.join(outDir, 'login.html');

if (!fs.existsSync(entry)) {
  console.error('Capacitor prep FAILED: missing out/immortality-vault/app.html — run npm run build first');
  process.exit(1);
}

// Redirect root to vault app (preserves /_next asset paths)
const redirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
  <meta http-equiv="refresh" content="0;url=/immortality-vault/app.html"/>
  <title>Immortality Vault</title>
  <style>body{background:#0a0a0f;color:#c084fc;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}</style>
</head>
<body><p>Loading Immortality Vault…</p>
<script>location.replace('/immortality-vault/app.html')</script>
</body>
</html>`;

fs.writeFileSync(index, redirectHtml);
console.log('Capacitor export: wrote out/index.html → /immortality-vault/app.html');

// Ensure login page exists for auth redirect flow
if (!fs.existsSync(login)) {
  const loginSrc = path.join(outDir, 'login.html');
  if (!fs.existsSync(loginSrc)) {
    console.warn('Capacitor export: login.html not found — auth redirect may need network');
  }
}

// Copy app icon for iOS asset generation reference
const iconSrc = path.join(__dirname, '..', 'public', 'icon.png');
const iconDst = path.join(outDir, 'icon.png');
if (fs.existsSync(iconSrc) && !fs.existsSync(iconDst)) {
  fs.copyFileSync(iconSrc, iconDst);
}

console.log('Capacitor export ready:', outDir);