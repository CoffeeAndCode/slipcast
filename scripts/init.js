'use strict';

const { execSync } = require('child_process');
const { join } = require('path');

module.exports = function(projectDirectory, appName, verbose) {
  if (verbose) {
    console.log(`Creating project for ${appName} in ${projectDirectory}...`);
  }

  // add `scripts` to package.json
  execSync(`cp ${verbose ? '-v' : ''} -R ${join(__dirname, '../template/')} ${projectDirectory}`, { stdio: 'inherit' });
}
