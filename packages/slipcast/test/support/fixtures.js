'use strict';

const { execSync } = require('child_process');
const { ensureDirSync, removeSync } = require('fs-extra');
const { join } = require('path');

function clean() {
  removeSync(join(__dirname, '../../../../.tmp'));
}

function createTmpDirectory() {
  removeSync(join(__dirname, '../../../../.tmp'));
  ensureDirSync(join(__dirname, '../../../../.tmp'));
}

function expectedFiles(fixtureName) {
  const processDir = process.cwd();
  process.chdir(join(__dirname, '../../../../.tmp'));
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const config = require(join(__dirname, '../../config/slipcast'));
  process.chdir(processDir);
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const testData = require(join(__dirname, '../../../../test/fixtures', fixtureName, 'test.json'));
  return testData.expectedFiles.sort().map(file => join(__dirname, '../../../../.tmp', config.output, file));
}

function expectedAndCompressedFiles(fixtureName) {
  const initialFiles = expectedFiles(fixtureName);
  const compressedFiles = initialFiles.filter(file => file.match(/\.(css|html|ico|jpg|jpeg|js|json|png|rss|xml)$/i))
    .map(file => `${file}.gz`);

  return initialFiles.concat(compressedFiles).sort();
}

function expectedFilesForWatch(fixtureName) {
  const processDir = process.cwd();
  process.chdir(join(__dirname, '../../../../.tmp'));
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const config = require(join(__dirname, '../../config/slipcast'));
  process.chdir(processDir);
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const testData = require(join(__dirname, '../../../../test/fixtures', fixtureName, 'test.json'));
  return testData.expectedFilesForWatch.sort().map(file => join(__dirname, '../../../../.tmp', config.output, file));
}

function loadFixture(fixtureName) {
  return () => {
    clean();
    execSync(`cp -R ${join(__dirname, '../../../../test/fixtures', fixtureName, '/')} ${join(__dirname, '../../../../.tmp')}`, {
      stdio: 'inherit',
    });
  };
}

module.exports = {
  clean,
  createTmpDirectory,
  expectedFiles,
  expectedFilesForWatch,
  expectedAndCompressedFiles,
  loadFixture,
};
