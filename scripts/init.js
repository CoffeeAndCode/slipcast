'use strict';

const { spawn } = require('child_process');
const { writeFile } = require('fs');
const { join } = require('path');

module.exports = function(projectDirectory, appName, verbose) {
  if (verbose) {
    console.log(`Creating project for ${appName} in ${projectDirectory}...`);
  }

  console.log('Updating package.json scripts');
  const packageJSON = require(join(projectDirectory, 'package.json'));
  packageJSON.scripts = {
    build: 'slipcast --build',
    compress: 'slipcast --compress',
    start: 'slipcast --watch'
  };
  writeFile(join(projectDirectory, 'package.json'), JSON.stringify(packageJSON, null, 2), function(error) {
    if (error) { throw error; }
  });

  console.log('Copying template into your project');
  spawn('cp', [verbose ? '-v' : '', '-R', join(__dirname, '../template/'), projectDirectory], { stdio: 'inherit' });
}
