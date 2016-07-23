'use strict';

const { spawn } = require('child_process');
const { readFile, writeFile } = require('fs');
const { join } = require('path');

module.exports = function(projectDirectory, appName, verbose) {
  if (verbose) {
    console.log(`Creating project for ${appName} in ${projectDirectory}...`);
  }

  console.log('Updating package.json scripts');
  const packageJSON = require(join(parentDirectory, 'package.json'));
  packageJSON.scripts = {
    build: 'slipcast --build',
    compress: 'slipcast --compress',
    start: 'slipcast --watch'
  };
  writeFile(join(parentDirectory, 'package.json'), JSON.stringify(packageJSON, null, 2), function(error, data) {
    if (error) { throw error; }
  });

  console.log('Copying template into your project');
  spawn('cp', [verbose ? '-v' : '', '-R', join(__dirname, '../template/'), projectDirectory], { stdio: 'inherit' });
}
