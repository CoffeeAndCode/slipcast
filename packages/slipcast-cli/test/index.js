'use strict';

const { exec } = require('child_process');
const { expect } = require('chai');
const { ensureDirSync } = require('fs-extra');
const { afterEach, beforeEach, describe, it } = require('mocha');
const pkg = require('../package.json');
const { join } = require('path');
const { clean, createTmpDirectory } = require('./support/fixtures');

describe('slipcast-cli', function testGlobalCLI() {
  const rootDirectory = join(__dirname, '../../../');

  this.slow(500);
  this.timeout(1000);

  describe('create project', function testCreateProject() {
    this.slow(30000);
    this.timeout(parseInt(process.env.TEST_TIMEOUT, 10) || 40000);
    afterEach(clean);
    beforeEach(createTmpDirectory);

    it('will show an error message if directory already exists', (done) => {
      ensureDirSync(join(rootDirectory, '.tmp/new-project'));

      exec(`${join(rootDirectory, 'packages/slipcast-cli', pkg.bin['slipcast-cli'])} new-project`, {
        cwd: join(rootDirectory, '.tmp'),
      }, (error, stdout, stderr) => {
        expect(stderr).to.equal('The directory `new-project` already exists. Aborting.\n');
        expect(stdout).to.equal('');
        done();
      });
    });

    it('will create the app if the project directory does not exist', (done) => {
      exec(`${join(rootDirectory, 'packages/slipcast-cli', pkg.bin['slipcast-cli'])} new-project --node_modules ${join(rootDirectory, 'node_modules')}`, {
        cwd: join(rootDirectory, '.tmp'),
      }, (error, stdout) => {
        expect(stdout).to.contain('Creating a new Slipcast app in ');
        done();
      });
    });

    it('will create a package.json file for the app', (done) => {
      exec(`${join(rootDirectory, 'packages/slipcast-cli', pkg.bin['slipcast-cli'])} new-project --node_modules ${join(rootDirectory, 'node_modules')}`, {
        cwd: join(rootDirectory, '.tmp'),
      }, () => {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const packageJson = require(join(rootDirectory, '.tmp/new-project/package.json'));
        expect(packageJson.name).to.eq('new-project');
        expect(packageJson.private).to.eq(true);
        expect(packageJson.version).to.eq('0.0.1');
        done();
      });
    });
  });
});
