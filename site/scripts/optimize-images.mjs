import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const srcDir = path.resolve(root, '..', 'Images');
const outDir = path.resolve(root, 'public', 'images');
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir);
function findByPrefix(prefix) {
  const f = files.find((name) => name.startsWith(prefix));
  if (!f) throw new Error(`File not found for prefix: ${prefix}`);
  return path.join(srcDir, f);
}

const mapping = [
  { prefix: '7e0a29c4', dst: 'hero.webp', w: 1920, q: 84 },
  { prefix: '7e0a29c4', dst: 'og-cover.jpg', w: 1200, h: 630, q: 85, jpg: true },
  { prefix: 'axw6zF', dst: 'gate.webp', w: 1400, q: 82 },
  { prefix: 'mfGVvU', dst: 'gate-2.webp', w: 1200, q: 82 },
  { prefix: 'quAprx', dst: 'stairs.webp', w: 1200, q: 82 },
  { prefix: '8PjQUL', dst: 'railing.webp', w: 1200, q: 82 },
  { prefix: 'ZnRdbp', dst: 'stairs-laser.webp', w: 1200, q: 82 },
  { prefix: 'DWFsz_', dst: 'stairs-modern.webp', w: 1200, q: 82 },
  { prefix: 'BU8K80', dst: 'stairs-spiral.webp', w: 1200, q: 82 },
  { prefix: 'qPCvNb', dst: 'stairs-villa.webp', w: 1200, q: 82 },
  { prefix: 'VsoN2K', dst: 'roof.webp', w: 1400, q: 82 },
  { prefix: 'i_8phx', dst: 'structure.webp', w: 1400, q: 82 },
  { prefix: 'gnZ1Ys', dst: 'team.webp', w: 1400, q: 82 },
  { prefix: '-HOFYD', dst: 'weld-close.webp', w: 1200, q: 82 },
  { prefix: 'ppKpcr', dst: 'weld-action.webp', w: 1400, q: 82 },
  { prefix: '-P0gG1', dst: 'weld-detail.webp', w: 1200, q: 82 },
  { prefix: 'nIQqZ2', dst: 'furniture.webp', w: 1200, q: 82 },
  { prefix: 'Y0_BNp', dst: 'industrial.webp', w: 1400, q: 82 },
  { prefix: 'A0WRrp', dst: 'workshop.webp', w: 1200, q: 82 },
  { prefix: 'AmN0UB', dst: 'cotonou.webp', w: 1400, q: 82 },
];

for (const m of mapping) {
  const inputBuf = fs.readFileSync(findByPrefix(m.prefix));
  let p = sharp(inputBuf).resize({
    width: m.w,
    height: m.h,
    fit: m.h ? 'cover' : 'inside',
    withoutEnlargement: true,
  });
  if (m.jpg) p = p.jpeg({ quality: m.q, progressive: true });
  else p = p.webp({ quality: m.q });
  const info = await p.toFile(path.join(outDir, m.dst));
  console.log(`${m.dst.padEnd(20)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}
