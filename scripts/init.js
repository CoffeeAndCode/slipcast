'use strict';

const promisify = require('es6-promisify');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const fse = require('fs-extra');
const copy = promisify(fse.copy);
const glob = require('glob');
const { basename, join } = require('path');

module.exports = function(projectDirectory, appName, verbose) {
  if (verbose) {
    console.log(`Creating project for ${appName} in ${projectDirectory}...`);
    console.log(`Running from ${process.cwd()}`);
    console.log('Updating package.json scripts');
  }

  const packageJSON = require(join(process.cwd(), 'package.json'));
  packageJSON.scripts = {
    build: 'slipcast --build',
    compress: 'slipcast --compress',
    eject: 'slipcast --eject',
    start: 'slipcast --watch'
  };
  const packageWritePromise = writeFile('package.json', JSON.stringify(packageJSON, null, 2));

  if (verbose) {
    console.log('Copying template into your project');
  }
  const fileCopyPromise = new Promise((resolve, reject) => {
    glob(join(__dirname, '../template', '*'), null, function (error, files) {
      if (error) { reject(error); return; }

      Promise.all(files.map(path => {
        return copy(path, join(process.cwd(), basename(path)));
      })).then(resolve).catch(reject);
    });
  });

  return Promise.all([fileCopyPromise, packageWritePromise]);
}
