'use strict';

const { spawn } = require('child_process');

module.exports.commandExists = function commandExists(command) {
  const isWindows = process.platform === 'win32';

  return new Promise((resolve) => {
    spawn(isWindows ? 'where' : 'type', [command], {
      shell: true,
      stdio: 'ignore',
    })
      .on('close', (exitCode) => {
        resolve(exitCode === 0);
      })
      .on('error', () => '');
  });
};
