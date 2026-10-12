const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('dist')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        // Skip .d.ts
        if (!file.endsWith('.d.ts')) {
          results.push(file);
        }
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname));

files.forEach(file => {
  const isTsx = file.endsWith('.tsx');
  const code = fs.readFileSync(file, 'utf8');
  
  try {
    const output = babel.transformSync(code, {
      filename: file,
      presets: [
        ['@babel/preset-typescript', {}]
      ],
      plugins: [
        '@babel/plugin-syntax-jsx'
      ],
      retainLines: true,
      generatorOpts: {
        retainLines: true,
      }
    });

    if (output && output.code) {
      const newExt = isTsx ? '.jsx' : '.js';
      const newFile = file.replace(/\.tsx?$/, newExt);
      
      // We want to keep imports but change .ts extensions in imports if any, although we usually import without extensions.
      fs.writeFileSync(newFile, output.code);
      fs.unlinkSync(file);
      console.log(`Converted: ${file} -> ${newFile}`);
    }
  } catch (e) {
    console.error(`Failed to convert ${file}:`, e);
  }
});
