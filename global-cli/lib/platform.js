'use strict';

const { spawn } = require('child_process');

module.exports.commandExists = function commandExists(command) {
  const isWindows = process.platform.substring(0, 3) === 'win';

  return new Promise((resolve) => {
    spawn(isWindows ? 'where' : 'type', [command], { stdio: 'ignore' })
      .on('close', (code) => {
        resolve(code === 0);
      })
      .on('error', () => '');
  });
};
