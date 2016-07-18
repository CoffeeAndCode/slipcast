const { join } = require('path');
const rimraf = require('rimraf');

module.exports = function() {
  rimraf.sync(join(__dirname, '../../.tmp/'));
}
