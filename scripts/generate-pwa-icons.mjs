#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 * Generiše sve potrebne ikone za PWA iz SVG source
 * 
 * USAGE:
 * 1. Instaliraj sharp: npm install --save-dev sharp
 * 2. Pokreni: node scripts/generate-pwa-icons.mjs
 * 
 * Alternativa ako nemaš sharp:
 * - Koristi online tool: https://realfavicongenerator.net/
 * - Ili: https://www.pwabuilder.com/imageGenerator
 * - Upload public/logo.svg i downloaduj sve veličine
 */

import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');
const iconsDir = join(publicDir, 'icons');

// Kreiraj icons folder ako ne postoji
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
  console.log('✅ Created public/icons/ directory');
}

// Sve potrebne veličine za PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('🎨 PWA Icon Generator\n');
console.log('📦 Potrebne veličine:', iconSizes.join('x, ') + 'x\n');

// Proveri da li postoji sharp
let sharp;
try {
  const sharpModule = await import('sharp');
  sharp = sharpModule.default;
  console.log('✅ Sharp library pronađena, generišem ikone...\n');
} catch (error) {
  console.warn('⚠️  Sharp import failed:', error);
  console.log('⚠️  Sharp library nije instalirana');
  console.log('📝 Instaliraj sa: npm install --save-dev sharp');
  console.log('🌐 ILI koristi online generator:\n');
  console.log('   • https://realfavicongenerator.net/');
  console.log('   • https://www.pwabuilder.com/imageGenerator');
  console.log('   • https://favicon.io/\n');
  console.log('📁 Upload fajl: public/logo.svg\n');
  console.log('💡 Alternativno, možeš koristiti bilo koju PNG sliku (512x512)');
  console.log('   i staviti je kao public/icons/source.png, pa pokrenuti script ponovo.\n');
  process.exit(0);
}

// Generiši ikone
const logoPath = join(publicDir, 'logo.svg');

if (!existsSync(logoPath)) {
  console.error('❌ Logo fajl ne postoji: public/logo.svg');
  console.log('💡 Prvo pokreni ovu komandu da generišeš logo, pa ponovo ovaj script.');
  process.exit(1);
}

try {
  const svgBuffer = readFileSync(logoPath);
  
  // Generiši sve veličine
  for (const size of iconSizes) {
    const outputPath = join(iconsDir, `icon-${size}x${size}.png`);
    
    await sharp(svgBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
      })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outputPath);
    
    console.log(`✅ Generated: icon-${size}x${size}.png`);
  }
  
  // Generiši favicon.ico (multi-size)
  const faviconPath = join(publicDir, 'favicon.ico');
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(faviconPath);
  
  console.log('✅ Generated: favicon.ico');
  
  // Generiši apple-touch-icon.png
  const appleTouchPath = join(publicDir, 'apple-touch-icon.png');
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(appleTouchPath);
  
  console.log('✅ Generated: apple-touch-icon.png');
  
  console.log('\n🎉 Sve ikone uspešno generisane!');
  console.log('📁 Lokacija: public/icons/\n');
  
} catch (error) {
  console.error('❌ Greška prilikom generisanja ikona:', error);
  console.log('\n💡 ALTERNATIVNI PRISTUP:');
  console.log('1. Otvori: https://realfavicongenerator.net/');
  console.log('2. Upload: public/logo.svg');
  console.log('3. Downloaduj generated package');
  console.log('4. Ekstraktuj u public/icons/\n');
  process.exit(1);
}

