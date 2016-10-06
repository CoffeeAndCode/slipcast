'use strict';

const { spawn } = require('child_process');
const { readdir } = require('fs');
const { copy, emptyDirSync, ensureDir } = require('fs-extra');
const { join } = require('path');
const config = require('../config/slipcast');

module.exports = () => {
  const outputFolder = join(process.cwd(), config.output);

  ensureDir(outputFolder, (error) => {
    if (error) {
      throw error;
    }

    emptyDirSync(outputFolder);

    readdir(join(process.cwd(), config.folders.static), (readDirError, files) => {
      files.forEach(file => copy(
        join(process.cwd(), config.folders.static, file),
        join(outputFolder, file)));
    });

    spawn('node', [join(__dirname, './build/css.js')], {
      stdio: 'inherit',
    });
    spawn('node', [join(__dirname, './build/html.js')], {
      stdio: 'inherit',
    });
    spawn('node', [join(__dirname, './build/js.js')], {
      stdio: 'inherit',
    });
  });
};
