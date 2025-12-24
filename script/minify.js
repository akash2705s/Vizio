const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const inputFile = path.join(__dirname, '../src/plugins/vizioCanvas.js');
const outputFile = path.join(__dirname, '../src/plugins/vizioCanvas.min.js');

async function minifyFile() {
  try {
    console.log('Reading file:', inputFile);
    const code = fs.readFileSync(inputFile, 'utf8');

    console.log('Minifying...');
    const result = await minify(code, {
      compress: {
        drop_console: false, // Keep console.log for debugging
        drop_debugger: true,
        pure_funcs: ['console.log'], // Remove console.log if you want
      },
      mangle: {
        reserved: ['getFocusSnapshot', 'resetBannerState', 'createTrappedDiv', 'vizioCornerBannerPlugin'], // Keep these names
      },
      format: {
        comments: false,
      },
    });

    if (result.error) {
      throw result.error;
    }

    fs.writeFileSync(outputFile, result.code, 'utf8');
    console.log('✓ Minified file created:', outputFile);
    console.log(`  Original size: ${(code.length / 1024).toFixed(2)} KB`);
    console.log(`  Minified size: ${(result.code.length / 1024).toFixed(2)} KB`);
    console.log(`  Reduction: ${((1 - result.code.length / code.length) * 100).toFixed(1)}%`);
  } catch (error) {
    console.error('Error minifying file:', error);
    process.exit(1);
  }
}

minifyFile();

