#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const outputDir = path.join(publicDir, 'optimized');

// Create optimized directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Image optimization configurations
const imageConfigs = [
  {
    format: 'webp',
    quality: 85,
    suffix: '.webp'
  },
  {
    format: 'avif',
    quality: 80,
    suffix: '.avif'
  }
];

// Function to find all image files recursively
function findImageFiles(dir, imageExtensions = ['.jpg', '.jpeg', '.png']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip the optimized directory to avoid infinite loops
      if (file !== 'optimized') {
        results = results.concat(findImageFiles(filePath, imageExtensions));
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (imageExtensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Function to get relative path from public directory
function getRelativePath(filePath) {
  return path.relative(publicDir, filePath);
}

// Function to create optimized directory structure
function createOptimizedPath(originalPath, format) {
  const relativePath = getRelativePath(originalPath);
  const parsedPath = path.parse(relativePath);
  const optimizedPath = path.join(outputDir, parsedPath.dir, `${parsedPath.name}.${format}`);
  
  // Create directory if it doesn't exist
  const dir = path.dirname(optimizedPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  return optimizedPath;
}

// Function to optimize a single image
async function optimizeImage(inputPath) {
  console.log(`Optimizing: ${getRelativePath(inputPath)}`);
  
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  console.log(`  Original: ${metadata.format} ${metadata.width}x${metadata.height} (${Math.round(fs.statSync(inputPath).size / 1024)}KB)`);
  
  for (const config of imageConfigs) {
    try {
      const outputPath = createOptimizedPath(inputPath, config.format);
      
      let pipeline = image.clone();
      
      if (config.format === 'webp') {
        pipeline = pipeline.webp({ quality: config.quality });
      } else if (config.format === 'avif') {
        pipeline = pipeline.avif({ quality: config.quality });
      }
      
      await pipeline.toFile(outputPath);
      
      const outputSize = Math.round(fs.statSync(outputPath).size / 1024);
      const compressionRatio = Math.round((1 - outputSize / Math.round(fs.statSync(inputPath).size / 1024)) * 100);
      
      console.log(`  → ${config.format.toUpperCase()}: ${outputSize}KB (${compressionRatio}% smaller)`);
    } catch (error) {
      console.error(`  Error creating ${config.format.toUpperCase()}:`, error.message);
    }
  }
  
  console.log('');
}

// Main function
async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  const imageFiles = findImageFiles(publicDir);
  
  if (imageFiles.length === 0) {
    console.log('No images found to optimize.');
    return;
  }
  
  console.log(`Found ${imageFiles.length} images to optimize:\n`);
  
  const startTime = Date.now();
  
  for (const imagePath of imageFiles) {
    try {
      await optimizeImage(imagePath);
    } catch (error) {
      console.error(`Failed to optimize ${getRelativePath(imagePath)}:`, error.message);
    }
  }
  
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  
  console.log(`✅ Optimization complete! Processed ${imageFiles.length} images in ${duration}s`);
  console.log(`📁 Optimized images saved to: public/optimized/`);
  console.log('\n💡 Next steps:');
  console.log('  1. Update your components to use the optimized images');
  console.log('  2. Implement fallback logic for unsupported browsers');
  console.log('  3. Add lazy loading with Next.js Image component');
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, findImageFiles };
