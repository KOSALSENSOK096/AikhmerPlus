import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateFavicons() {
  const sizes = [16, 32, 48, 96, 144, 192, 512];
  const svgBuffer = fs.readFileSync(join(__dirname, 'favicon.svg'));

  // Generate PNGs
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(__dirname, `favicon-${size}x${size}.png`));
  }

  // Create specific files
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(__dirname, 'favicon-32x32.png'));

  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(join(__dirname, 'favicon-16x16.png'));

  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(join(__dirname, 'apple-touch-icon.png'));

  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(join(__dirname, 'android-chrome-192x192.png'));

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(join(__dirname, 'android-chrome-512x512.png'));

  // Create ICO file (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(__dirname, 'favicon.ico'));
}

generateFavicons().catch(console.error); 