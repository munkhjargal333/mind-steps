// generate-icons.mjs
// Ашиглах: node generate-icons.mjs
// Шаардлага: npm install sharp (эсвэл: npm install canvas)
//
// sharp байхгүй бол: npm i -D sharp

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const OUT = './public/icons';
fs.mkdirSync(OUT, { recursive: true });

// ── SVG template ─────────────────────────────────────────────
// AppLogo.tsx-ийн LogoMark-тай яг адил
function makeSVG(px) {
  const r = px / 2;
  const inner = r * 0.38;
  const rayLen = r * 0.22;
  const rayStart = inner + r * 0.10;
  const strokeW = px * 0.055;
  const dotR = inner * 0.32;

  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x1 = r + cos * rayStart;
    const y1 = r + sin * rayStart;
    const x2 = r + cos * (rayStart + rayLen);
    const y2 = r + sin * (rayStart + rayLen);
    const opacity = i % 2 === 0 ? 1 : 0.65;
    return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="white" stroke-width="${strokeW.toFixed(2)}" stroke-linecap="round" opacity="${opacity}"/>`;
  }).join('\n    ');

  return `<svg width="${px}" height="${px}" viewBox="0 0 ${px} ${px}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <clipPath id="clip">
      <rect width="${px}" height="${px}" rx="${(px * 0.28).toFixed(2)}" ry="${(px * 0.28).toFixed(2)}"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="${px}" height="${px}" rx="${(px * 0.28).toFixed(2)}" fill="url(#g)"/>

  <!-- Rays -->
  <g clip-path="url(#clip)">
    ${rays}
  </g>

  <!-- White circle -->
  <circle cx="${r}" cy="${r}" r="${inner.toFixed(2)}" fill="white" opacity="0.95"/>

  <!-- Amber dot -->
  <circle cx="${r}" cy="${r}" r="${dotR.toFixed(2)}" fill="url(#g)"/>
</svg>`;
}

// ── Generate ──────────────────────────────────────────────────
const icons = [
  { name: 'icon-192.png',          size: 192 },
  { name: 'icon-512.png',          size: 512 },
  { name: 'icon-512-maskable.png', size: 512 },
  { name: 'apple-touch-icon.png',  size: 180 },
  { name: 'shortcut-write.png',    size: 96  },
  { name: 'shortcut-entries.png',  size: 96  },
];

for (const { name, size } of icons) {
  const svg = Buffer.from(makeSVG(size));
  const outPath = path.join(OUT, name);
  await sharp(svg).png().toFile(outPath);
  console.log(`✅ ${outPath}`);
}

console.log('\n🎉 Бүх icon үүслээ → public/icons/');
