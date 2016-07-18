const clean = require('./support/clean');
const {afterEach, describe, it} = require('mocha');
const {expect} = require('chai');
const {exec} = require('child_process');
const pkg = require('../package.json');

describe('CLI', function() {
  describe('build', () => {
    afterEach(clean);

    // TODO: write tests
  });

  describe('compress', () => {
    afterEach(clean);

    // TODO: write tests
  });

  describe('help', () => {
    it('will return usage info with --help', done => {
      exec(`${pkg.bin} --help`, (error, stdout) => {
        expect(stdout).to.contain(`A static site builder built on Metalsmith, PostCSS, and Rollup.js. (v${pkg.version})`);
        done();
      });
    });

    it('will return usage info with -h', done => {
      exec(`${pkg.bin} -h`, (error, stdout) => {
        expect(stdout).to.contain(`A static site builder built on Metalsmith, PostCSS, and Rollup.js. (v${pkg.version})`);
        done();
      });
    });
  });

  describe('version', function() {
    it('will return the version number with --version', done => {
      exec(`${pkg.bin} --version`, (error, stdout) => {
        expect(stdout).to.eq(`${pkg.version}\n`);
        done();
      });
    });

    it('will return the version number with -v', done => {
      exec(`${pkg.bin} -v`, (error, stdout) => {
        expect(stdout).to.eq(`${pkg.version}\n`);
        done();
      });
    });
  });

  describe('watch', () => {
    afterEach(clean);

    // TODO: write tests
  });
});
