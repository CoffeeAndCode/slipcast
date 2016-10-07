const { exec } = require('child_process');
const { expect } = require('chai');
const { ensureDirSync } = require('fs-extra');
const { afterEach, beforeEach, describe, it } = require('mocha');
const pkg = require('../../global-cli/package.json');
const { join } = require('path');
const { clean, createTmpDirectory } = require('../support/fixtures');

describe('global-cli', () => {
  this.slow(500);
  this.timeout(1000);

  describe('create project', () => {
    this.slow(20000);
    this.timeout(parseInt(process.env.TEST_TIMEOUT, 10) || 30000);
    afterEach(clean);
    beforeEach(createTmpDirectory);

    it('will show an error message if directory already exists', (done) => {
      ensureDirSync(join(__dirname, '../../.tmp/new-project'));

      exec(`${join(__dirname, '../../global-cli', pkg.bin)} new-project`, {
        cwd: join(__dirname, '../../.tmp'),
      }, (error, stdout, stderr) => {
        expect(stderr).to.equal('The directory `new-project` already exists. Aborting.\n');
        expect(stdout).to.equal('');
        done();
      });
    });

    it('will create the app if the project directory does not exist', (done) => {
      exec(`${join(__dirname, '../../global-cli', pkg.bin)} new-project --node_modules ${join(__dirname, '../../node_modules')}`, {
        cwd: join(__dirname, '../../.tmp'),
      }, (error, stdout) => {
        expect(stdout).to.contain('Creating a new Slipcast app in ');
        done();
      });
    });

    it('will create a package.json file for the app', (done) => {
      exec(`${join(__dirname, '../../global-cli', pkg.bin)} new-project --node_modules ${join(__dirname, '../../node_modules')}`, {
        cwd: join(__dirname, '../../.tmp')
      }, () => {
        const packageJson = require(join(__dirname, '../../.tmp/new-project/package.json'));
        expect(packageJson.name).to.eq('new-project');
        expect(packageJson.private).to.eq(true);
        expect(packageJson.version).to.eq('0.0.1');
        done();
      });
    });
  });
});
