const { spawn } = require('child_process');
const { join } = require('path');

module.exports = function() {
  spawn(join(__dirname, '../../scripts/compress.js'), { stdio: 'inherit' });
}
