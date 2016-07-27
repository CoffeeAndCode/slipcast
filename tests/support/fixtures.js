const { execSync } = require('child_process');
const { ensureDirSync, removeSync } = require('fs-extra');
const { join } = require('path');

function clean() {
  removeSync(join(__dirname, '../../.tmp'));
}

function createTmpDirectory() {
  removeSync(join(__dirname, '../../.tmp'));
  ensureDirSync(join(__dirname, '../../.tmp'));
}

function expectedAndCompressedFiles(fixtureName) {
  const initialFiles = expectedFiles(fixtureName);
  const compressedFiles = initialFiles.filter(file => {
    return file.match(/\.(css|html|ico|jpg|jpeg|js|json|png|rss|xml)$/i);
  }).map(file => file + '.gz');

  return initialFiles.concat(compressedFiles).sort();
}

function expectedFiles(fixtureName) {
  const processDir = process.cwd();
  process.chdir(join(__dirname, '../../.tmp'));
  const config = require(join(__dirname, '../../config/slipcast'));
  process.chdir(processDir);
  const testData = require(join(__dirname, '../fixtures', fixtureName, 'test.json'));
  return testData.expectedFiles.sort().map(file => {
    return join(__dirname, '../../.tmp', config.output, file);
  });
}

function expectedFilesForWatch(fixtureName) {
  const processDir = process.cwd();
  process.chdir(join(__dirname, '../../.tmp'));
  const config = require(join(__dirname, '../../config/slipcast'));
  process.chdir(processDir);
  const testData = require(join(__dirname, '../fixtures', fixtureName, 'test.json'));
  return testData.expectedFilesForWatch.sort().map(file => {
    return join(__dirname, '../../.tmp', config.output, file);
  });
}

function loadFixture(fixtureName) {
  return function () {
    clean();
    execSync(`cp -R ${join(__dirname, '../fixtures', fixtureName, '/')} ${join(__dirname, '../../.tmp')}`, { stdio: 'inherit' });
  }
}

module.exports = {
  clean: clean,
  createTmpDirectory: createTmpDirectory,
  expectedFiles: expectedFiles,
  expectedFilesForWatch: expectedFilesForWatch,
  expectedAndCompressedFiles: expectedAndCompressedFiles,
  loadFixture: loadFixture
}
