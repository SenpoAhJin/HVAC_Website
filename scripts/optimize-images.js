import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const IMAGE_DIR = 'public/images/Image_Assets';
const MAX_WIDTH = 1200; // Maximum width for images
const QUALITY = 85; // JPEG quality (0-100)

async function getAllImageFiles(dir) {
  const files = [];
  const items = await readdir(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stats = await stat(fullPath);
    
    if (stats.isDirectory()) {
      const subFiles = await getAllImageFiles(fullPath);
      files.push(...subFiles);
    } else if (['.jpg', '.jpeg', '.png'].includes(extname(item).toLowerCase())) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function optimizeImage(filePath) {
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Get original file size
    const stats = await stat(filePath);
    const originalSize = stats.size;
    
    console.log(`Processing: ${filePath}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB, ${metadata.width}x${metadata.height}`);
    
    // Resize if too large and re-encode with quality setting
    await image
      .resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: QUALITY, progressive: true })
      .toFile(filePath + '.optimized');
    
    // Replace original with optimized
    const { rename, unlink } = await import('fs/promises');
    await unlink(filePath);
    await rename(filePath + '.optimized', filePath);
    
    // Get new file size
    const newStats = await stat(filePath);
    const newSize = newStats.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`  Optimized: ${(newSize / 1024).toFixed(2)} KB (saved ${savings}%)\n`);
    
    return {
      file: filePath,
      originalSize,
      newSize,
      savings: originalSize - newSize
    };
  } catch (error) {
    console.error(`Error optimizing ${filePath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('Starting image optimization...\n');
  console.log(`Directory: ${IMAGE_DIR}`);
  console.log(`Max width: ${MAX_WIDTH}px`);
  console.log(`Quality: ${QUALITY}%\n`);
  
  const imageFiles = await getAllImageFiles(IMAGE_DIR);
  console.log(`Found ${imageFiles.length} images\n`);
  
  const results = [];
  for (const file of imageFiles) {
    const result = await optimizeImage(file);
    if (result) results.push(result);
  }
  
  // Summary
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
  const totalSavings = totalOriginal - totalNew;
  const percentSavings = ((totalSavings / totalOriginal) * 100).toFixed(1);
  
  console.log('='.repeat(60));
  console.log('OPTIMIZATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`Total images: ${results.length}`);
  console.log(`Original size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized size: ${(totalNew / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings: ${(totalSavings / 1024 / 1024).toFixed(2)} MB (${percentSavings}%)`);
}

main().catch(console.error);
