const { spawn } = require('child_process');
const { join } = require('path');

module.exports = function() {
  spawn(join(__dirname, '../../bin/compress.js'), { stdio: 'inherit' });
}
