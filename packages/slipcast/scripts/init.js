'use strict';

const promisify = require('es6-promisify');
const fs = require('fs');
const fse = require('fs-extra');
const glob = require('glob');
const { basename, join } = require('path');

const copy = promisify(fse.copy);
const writeFile = promisify(fs.writeFile);

module.exports = (projectDirectory, appName, verbose) => {
  if (verbose) {
    console.log(`Creating project for ${appName} in ${projectDirectory}...`);
    console.log(`Running from ${process.cwd()}`);
    console.log('Updating package.json scripts');
  }

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const packageJSON = require(join(process.cwd(), 'package.json'));
  packageJSON.scripts = {
    build: 'slipcast --build',
    compress: 'slipcast --compress',
    eject: 'slipcast --eject',
    start: 'slipcast --watch',
  };
  const packageWritePromise = writeFile('package.json', JSON.stringify(packageJSON, null, 2));

  if (verbose) {
    console.log('Copying template into your project');
  }
  const fileCopyPromise = new Promise((resolve, reject) => {
    glob(join(__dirname, '../template', '*'), null, (error, files) => {
      if (error) {
        reject(error);
        return;
      }
      files.push(join(__dirname, '../template', '.gitignore'));
      Promise.all(files.map(path => copy(path, join(process.cwd(), basename(path)))))
        .then(resolve).catch(reject);
    });
  });

  return Promise.all([fileCopyPromise, packageWritePromise]);
};
