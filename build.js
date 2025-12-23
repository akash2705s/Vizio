// build.js
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const method = process.env.npm_lifecycle_event || 'start';
// Try to get brand from argv or env
const brandArg = process.argv[2];
const brandEnv = process.env.BRAND;
const brand = brandArg || brandEnv;
const preBuild = true;
const postPrefixForBuild = '';

if (!brand) {
  console.error(
    '❌ Usage: npm run build <brand>   OR   BRAND=brand1 npm run build'
  );
  process.exit(1);
}
if (method !== 'build' && method !== 'start') {
  console.error(
    '❌ This script should be run with "npm run build <brand>" or "npm run start <brand>"'
  );
  process.exit(1);
}

console.log(`🏷️  Building for brand: ${brand}`);

// 1) Run pre-script with brand
const nodePath = process.execPath;
const preScriptPath = path.join(__dirname, 'pre-script.js');

let r = spawnSync(nodePath, [preScriptPath, brand], { stdio: 'inherit' });
if (r.error) {
  console.error('Error running pre-script:', r.error);
  process.exit(1);
}
if (r.status !== 0) process.exit(r.status);

// 2) Run the real build (react-scripts) directly via Node (no npm shell)
const reactScript = method === 'build' ? 'build' : 'start';
const reactScriptsCli = require.resolve(`react-scripts/scripts/${reactScript}`);

r = spawnSync(nodePath, [reactScriptsCli], { stdio: 'inherit' });
if (r.error) {
  console.error('Error running react build:', r.error);
  process.exit(1);
}
if (r.status !== 0) process.exit(r.status);

// const brands =  ["Action_Plus",
//         "Black_Voices_Plus",
//         "Cartoons_Plus",
//         "Classic_Movies_Plus",
//         "Comedy_Plus",
//         "Crime_Plus",
//         "Documentary_Max",
//         "Family_Flix_Plus",
//         "Horror_Plus",
//         "Peliculas_Gratis_Plus",
//         "ScreenSavers_Plus",
//         "VHS_Plus",
//         "Westerns_Plus"];
if (method === 'build' && preBuild) {
  let buildFolder = '';

  switch (brand) {
    case 'Action_Plus':
      buildFolder = 'action';
      break;
    case 'Black_Voices_Plus':
      buildFolder = 'black-voices';
      break;
    case 'Cartoons_Plus':
      buildFolder = 'cartoons';
      break;
    case 'Classic_Movies_Plus':
      buildFolder = 'classic-movies';
      break;
    case 'Comedy_Plus':
      buildFolder = 'comedy';
      break;
    case 'Crime_Plus':
      buildFolder = 'crime';
      break;
    case 'Documentary_Max':
      buildFolder = 'documentary-max';
      break;
    case 'Family_Flix_Plus':
      buildFolder = 'family-flix';
      break;
    case 'Horror_Plus':
      buildFolder = 'horror';
      break;
    case 'Peliculas_Gratis_Plus':
      buildFolder = 'peliculas-gratis';
      break;
    case 'ScreenSavers_Plus':
      buildFolder = 'screensavers';
      break;
    case 'VHS_Plus':
      buildFolder = 'vhs';
      break;
    case 'Westerns_Plus':
      buildFolder = 'westerns';
      break;
    default:
      // buildFolder = brand.toLowerCase();
      break;
  }

  if (buildFolder && buildFolder.length > 0) {
    // Example: move build to brand-specific folder

    const targetDir = path.join(
      __dirname,
      'builds',
      buildFolder + postPrefixForBuild
    );
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true });
    }
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.renameSync(path.join(__dirname, 'build'), targetDir);
    console.log(`✅ Build moved to ${targetDir}`);
  }
}

console.log(`🎉 Build completed for ${brand}`);
