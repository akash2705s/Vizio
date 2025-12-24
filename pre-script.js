const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

const appName = process.argv[2];

const brand = process.argv[2];
if (!brand) {
  console.error('❌ Please provide brand name. Example:');
  console.error('   npm run build -- brand1');
  process.exit(1);
}

if (!appName) {
  console.error(
    '❌ Please provide a app name. Example: npm run build actionTV'
  );
  process.exit(1);
}

const sourceDir = path.join(__dirname, 'brand', appName);
dotenv.config({ path: `${sourceDir}/env` });

console.log(`Setting up for app: ${appName}`);
fs.writeFileSync(
  './public/env.js',
  `window.ENV = ${JSON.stringify(process.env)};`
);
console.log(`✅ env.js file created with environment variables.`);

const manifestPath = './public/manifest.json'; // adjust if in different folder

// Read the existing manifest
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

// Update fields
manifest.name = process.env.REACT_APP_NAME || 'App';
manifest.short_name = process.env.REACT_APP_NAME || 'App';
manifest.background_color =
  process.env.REACT_APP_BASE_PRIMARY_COLOR || '#F67415';

// Write it back
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`✅ Updated manifest.json with name: ${manifest.name}`);

const targetDir = path.join(__dirname);
const replaceFile = [
  { source: `${sourceDir}/logo.png`, target: `${targetDir}/public/logo.png` },
  {
    source: `${sourceDir}/logo.png`,
    target: `${targetDir}/src/assets/images/logo.png`,
  },
  {
    source: `${sourceDir}/splash.png`,
    target: `${targetDir}/src/assets/images/splash.png`,
  },
  { source: `${sourceDir}/env`, target: `${targetDir}/.env` },
];

// Recursively copy files
replaceFile.forEach((fileItem) => {
  fs.copyFileSync(fileItem.source, fileItem.target);
  console.log(`✅ Copied: ${fileItem.source} → ${fileItem.target}`);
});
