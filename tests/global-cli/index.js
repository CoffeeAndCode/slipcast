const { exec } = require('child_process');
const { expect } = require('chai');
const mkdirp = require('mkdirp');
const { afterEach, beforeEach, describe, it } = require('mocha');
const pkg = require('../../global-cli/package.json');
const { join } = require('path');
const { clean, createTmpDirectory } = require('../support/fixtures');

describe('global-cli', function() {
  this.slow(500);
  this.timeout(1000);

  describe('create project', function() {
    this.slow(20000);
    this.timeout(30000);
    afterEach(clean);
    beforeEach(createTmpDirectory);

    it('will show an error message if directory already exists', function(done) {
      mkdirp.sync(join(__dirname, '../../.tmp/new-project'));

      exec(`${join(__dirname, '../../global-cli', pkg.bin)} new-project`, {
        cwd: join(__dirname, '../../.tmp')
      }, (error, stdout, stderr) => {
        expect(stderr).to.equal("The directory `new-project` already exists. Aborting.\n");
        expect(stdout).to.equal('');
        done();
      });
    });

    it('will create the app if the project directory does not exist', function(done) {
      exec(`${join(__dirname, '../../global-cli', pkg.bin)} new-project`, {
        cwd: join(__dirname, '../../.tmp')
      }, (error, stdout) => {
        expect(stdout).to.contain('Creating a new Slipcast app in ');
        done();
      });
    });

    it('will create a package.json file for the app', function(done) {
      exec(`${join(__dirname, '../../global-cli', pkg.bin)} new-project`, {
        cwd: join(__dirname, '../../.tmp')
      }, () => {
        const package = require(join(__dirname, '../../.tmp/new-project/package.json'));
        expect(package.name).to.eq('new-project');
        expect(package.private).to.eq(true);
        expect(package.version).to.eq('0.0.1');
        done();
      });
    });
  });

  describe('help', function() {
    it('will return usage info with --help', function(done) {
      exec(`${pkg.bin} --help`, {
        cwd: join(__dirname, '../../global-cli/')
      }, (error, stdout, stderr) => {
        expect(stderr).to.equal('');
        expect(stdout).to.contain(`A minimal config static website builder you can leave at anytime. (v${pkg.version})`);
        done();
      });
    });

    it('will return usage info with -h', function(done) {
      exec(`${pkg.bin} -h`, {
        cwd: join(__dirname, '../../global-cli/')
      }, (error, stdout, stderr) => {
        expect(stderr).to.equal('');
        expect(stdout).to.contain(`A minimal config static website builder you can leave at anytime. (v${pkg.version})`);
        done();
      });
    });
  });

  describe('version', function() {
    it('will return the version number with --version', function(done) {
      exec(`${pkg.bin} --version`, {
        cwd: join(__dirname, '../../global-cli/')
      }, (error, stdout, stderr) => {
        expect(stderr).to.equal('');
        expect(stdout).to.equal(`${pkg.version}\n`);
        done();
      });
    });

    it('will return the version number with -v', function(done) {
      exec(`${pkg.bin} -v`, {
        cwd: join(__dirname, '../../global-cli/')
      }, (error, stdout, stderr) => {
        expect(stderr).to.equal('');
        expect(stdout).to.equal(`${pkg.version}\n`);
        done();
      });
    });
  });
});
