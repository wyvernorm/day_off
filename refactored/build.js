// ==========================================
// 🔨 build.js - Build Script
// ==========================================

import * as esbuild from 'esbuild';
import { readFileSync } from 'fs';

const isWatch = process.argv.includes('--watch');

// Read CSS
const css = readFileSync('./src/styles/main.css', 'utf-8');

// Build configuration
const config = {
  entryPoints: ['./src/main.js'],
  bundle: true,
  outfile: './frontend.js',
  format: 'esm',
  platform: 'neutral',
  target: 'es2020',
  minify: false, // ปิด minify เพื่อให้อ่านง่าย
  sourcemap: false,
  banner: {
    js: `// ==========================================
// 📦 Shift Manager - Built with Modules
// Generated: ${new Date().toISOString()}
// ==========================================\n`
  },
  define: {
    '__CSS__': JSON.stringify(css)
  }
};

async function build() {
  try {
    if (isWatch) {
      console.log('👀 Watching for changes...');
      const ctx = await esbuild.context(config);
      await ctx.watch();
    } else {
      console.log('🔨 Building...');
      await esbuild.build(config);
      console.log('✅ Build complete!');
      console.log('📦 Output: frontend.js');
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
