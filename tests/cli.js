const clean = require('./support/clean');
const { afterEach, beforeEach, describe, it } = require('mocha');
const { expect } = require('chai');
const { exec, spawn } = require('child_process');
const glob = require('glob');
const { expectedAndCompressedFiles, expectedFiles, loadFixture } = require('./support/fixtures');
const { join } = require('path');
const pkg = require('../package.json');
const psTree = require('ps-tree');

describe('CLI', function() {
  this.slow(2000);

  describe('build', function() {
    afterEach(clean);
    beforeEach(loadFixture('full-example'));

    it('will build files in the provided destination with --build', function(done) {
      exec(`${join('../', pkg.bin)} --build`, {
        cwd: join(__dirname, '../.tmp')
      }, (error, stdout, stderr) => {
        expect(stdout).to.equal('');
        expect(stderr).to.equal('');

        glob(join(__dirname, '../.tmp/dist', '**/*'), null, function (error, files) {
          expect(files).to.deep.equal(expectedFiles('full-example'));
          done();
        });
      });
    });

    it('will build files in the provided destination with -b', function(done) {
      exec(`${join('../', pkg.bin)} -b`, {
        cwd: join(__dirname, '../.tmp')
      }, (error, stdout, stderr) => {
        expect(stdout).to.equal('');
        expect(stderr).to.equal('');

        glob(join(__dirname, '../.tmp/dist', '**/*'), null, function (error, files) {
          expect(files).to.deep.equal(expectedFiles('full-example'));
          done();
        });
      });
    });
  });

  describe('compress', function() {
    afterEach(clean);
    beforeEach(loadFixture('full-example'));

    it('will created compressed versions of files in output dir with -c', function(done) {
      exec(`${join('../', pkg.bin)} --build`, {
        cwd: join(__dirname, '../.tmp')
      }, (error, stdout, stderr) => {
        expect(stdout).to.equal('');
        expect(stderr).to.equal('');

        exec(`${join('../', pkg.bin)} -c`, {
          cwd: join(__dirname, '../.tmp')
        }, (error, stdout, stderr) => {
          expect(stdout).to.equal('');
          expect(stderr).to.equal('');

          glob(join(__dirname, '../.tmp/dist', '**/*'), null, function (error, files) {
            expect(files).to.deep.equal(expectedAndCompressedFiles('full-example'));
            done();
          });
        });
      });
    });

    it('will created compressed versions of files in output dir with --compress', function(done) {
      exec(`${join('../', pkg.bin)} --build`, {
        cwd: join(__dirname, '../.tmp')
      }, (error, stdout, stderr) => {
        expect(stdout).to.equal('');
        expect(stderr).to.equal('');

        exec(`${join('../', pkg.bin)} --compress`, {
          cwd: join(__dirname, '../.tmp')
        }, (error, stdout, stderr) => {
          expect(stdout).to.equal('');
          expect(stderr).to.equal('');

          glob(join(__dirname, '../.tmp/dist', '**/*'), null, function (error, files) {
            expect(files).to.deep.equal(expectedAndCompressedFiles('full-example'));
            done();
          });
        });
      });
    });
  });

  describe('help', () => {
    it('will return usage info with --help', function(done) {
      exec(`${pkg.bin} --help`, (error, stdout, stderr) => {
        expect(stderr).to.equal('');
        expect(stdout).to.contain(`A static site builder built on Metalsmith, PostCSS, and Rollup.js. (v${pkg.version})`);
        done();
      });
    });

    it('will return usage info with -h', function(done) {
      exec(`${pkg.bin} -h`, (error, stdout, stderr) => {
        expect(stderr).to.equal('');
        expect(stdout).to.contain(`A static site builder built on Metalsmith, PostCSS, and Rollup.js. (v${pkg.version})`);
        done();
      });
    });
  });

  describe('version', function() {
    it('will return the version number with --version', function(done) {
      exec(`${pkg.bin} --version`, (error, stdout, stderr) => {
        expect(stderr).to.equal('');
        expect(stdout).to.equal(`${pkg.version}\n`);
        done();
      });
    });

    it('will return the version number with -v', function(done) {
      exec(`${pkg.bin} -v`, (error, stdout, stderr) => {
        expect(stderr).to.equal('');
        expect(stdout).to.equal(`${pkg.version}\n`);
        done();
      });
    });
  });

  describe('watch', function() {
    this.timeout(10000);

    afterEach(clean);
    beforeEach(loadFixture('full-example'));

    it('will build and watch files in the provided destination with --watch', function(done) {
      let shuttingDown = false;
      const task = spawn(join(__dirname, '../', pkg.bin), ['--watch'], {
        cwd: join(__dirname, '../.tmp')
      });

      task.stdout.on('data', () => {
        if (!shuttingDown) {
          glob(join(__dirname, '../.tmp/dist', '**/*'), null, function (error, files) {
            if (files.toString() === expectedFiles('full-example').toString()) {
              shuttingDown = true;
              psTree(task.pid, function (err, children) {
                spawn('kill', ['-9'].concat(children.map(p => p.PID)));
              });
              task.kill();
            }
          });
        }
      });

      task.on('error', done);

      task.on('close', () => {
        done();
      });

      setTimeout(() => {
        psTree(task.pid, function (err, children) {
          spawn('kill', ['-9'].concat(children.map(p => p.PID)));
        });
        task.kill();
      }, 5000);
    });

    it('will build and watch files in the provided destination with -w', function(done) {
      let shuttingDown = false;
      const task = spawn(join('../', pkg.bin), ['-w'], {
        cwd: join(__dirname, '../.tmp')
      });

      task.stdout.on('data', () => {
        if (!shuttingDown) {
          glob(join(__dirname, '../.tmp/dist', '**/*'), null, function (error, files) {
            if (files.toString() === expectedFiles('full-example').toString()) {
              shuttingDown = true;
              psTree(task.pid, function (err, children) {
                spawn('kill', ['-9'].concat(children.map(p => p.PID)));
              });
              task.kill();
            }
          });
        }
      });

      task.on('error', done);

      task.on('close', () => {
        done();
      });

      setTimeout(() => {
        psTree(task.pid, function (err, children) {
          spawn('kill', ['-9'].concat(children.map(p => p.PID)));
        });
        task.kill();
      }, 5000);
    });
  });
});
