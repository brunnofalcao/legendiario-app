/**
 * LEGENDIARIO — Gerar ícones PWA a partir de uma logo 1024x1024
 * Uso: node scripts/generate-icons.js ./logo-source.png
 * Instalar: npm install sharp
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = process.argv[2];
if (!src || !fs.existsSync(src)) { console.error('Logo source não encontrada'); process.exit(1); }

const outDir = path.resolve('./public/icons');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const sizes = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'icon-maskable-192.png', size: 192, pad: 0.15 },
  { file: 'icon-maskable-512.png', size: 512, pad: 0.15 },
  { file: 'apple-touch-icon.png', size: 180 }
];

(async () => {
  for (const { file, size, pad = 0 } of sizes) {
    const img = sharp(src).resize({ width: Math.round(size * (1 - pad * 2)), height: Math.round(size * (1 - pad * 2)), fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
    const final = sharp({ create: { width: size, height: size, channels: 4, background: pad > 0 ? '#FF4D14' : { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: await img.png().toBuffer(), gravity: 'center' }])
      .png();
    await final.toFile(path.join(outDir, file));
    console.log(`✅ ${file}`);
  }
})();
