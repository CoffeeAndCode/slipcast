const { spawn } = require('child_process');
const { readdir } = require('fs');
const { copy, emptyDirSync, ensureDir } = require('fs-extra');
const { join } = require('path');

module.exports = () => {
  const config = require('../config/slipcast');

  const outputFolder = join(process.cwd(), config.output);

  ensureDir(outputFolder, (error) => {
    if (error) {
      throw error;
    }

    emptyDirSync(outputFolder);

    readdir(join(process.cwd(), config.folders.static), (error, files) => {
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
