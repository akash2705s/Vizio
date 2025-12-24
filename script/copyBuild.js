const fs = require('fs');

// Get branch name from command line argument
const branch = process.argv[2];
// const basePath = '/store/';
const path = require('path');
// const basePath = 'process.argv[2]';

console.log('Full branch:', branch);

// Example: release-lg-1.3.5
// Extract version number using regex
// const match = branch.match(/release-[a-z]+-(\d+\.\d+\.\d+)/);

const sourcePath = path.join(process.cwd(), '../build/lg');
const folderPath = path.join(process.cwd(), '../', 'store', branch);

if (folderPath) {
  fs.mkdirSync(folderPath, { recursive: true });
  fs.cpSync(sourcePath, folderPath, { recursive: true });
  console.log(`✅ Folder copy at : ${folderPath}`);
} else {
  console.log('No version found');
}
