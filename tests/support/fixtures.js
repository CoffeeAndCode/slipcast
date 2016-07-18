const { execSync } = require('child_process');
const { join } = require('path');
const rimraf = require('rimraf');

module.exports.expectedFiles = function(fixtureName) {
  const config = require(join(__dirname, '../fixtures', fixtureName, 'static.json'));
  return config.test.expectedFiles.sort().map(file => {
    return join(__dirname, '../../.tmp', config.output, file);
  });
}

module.exports.loadFixture = function(fixtureName) {
  return function () {
    rimraf.sync(join(__dirname, '../../.tmp'));
    execSync(`cp -R ${join(__dirname, '../fixtures', fixtureName, '/')} ${join(__dirname, '../../.tmp')}`, { stdio: 'inherit' });
  }
}
