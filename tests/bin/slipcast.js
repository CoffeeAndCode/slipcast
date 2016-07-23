const { afterEach, beforeEach, describe, it } = require('mocha');
const { expect } = require('chai');
const { exec, spawn } = require('child_process');
const { readFileSync } = require('fs');
const glob = require('glob');
const { get } = require('http');
const { clean, expectedAndCompressedFiles, expectedFiles, expectedFilesForWatch, loadFixture } = require('../support/fixtures');
const { join } = require('path');
const pkg = require('../../package.json');
const psTree = require('ps-tree');

describe('CLI', function() {
  this.slow(2 * 1000);
  this.timeout(20 * 1000);
  afterEach(clean);

  describe('barebones template', function() {
    beforeEach(loadFixture('barebones'));

    describe('build', function() {
      it('will build files in the provided destination with --build', function(done) {
        exec(`${join(__dirname, '../../', pkg.bin)} --build`, {
          cwd: join(__dirname, '../../.tmp')
        }, (error, stdout, stderr) => {
          expect(stdout).to.equal('');
          expect(stderr).to.equal('');

          glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
            expect(files).to.deep.equal(expectedFiles('barebones'));
            done();
          });
        });
      });

      it('will build files in the provided destination with -b', function(done) {
        exec(`${join(__dirname, '../../', pkg.bin)} -b`, {
          cwd: join(__dirname, '../../.tmp')
        }, (error, stdout, stderr) => {
          expect(stdout).to.equal('');
          expect(stderr).to.equal('');

          glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
            expect(files).to.deep.equal(expectedFiles('barebones'));
            done();
          });
        });
      });

      it('will use the secondary.hbs layout for deep/index.html', function(done) {
        exec(`${join(__dirname, '../../', pkg.bin)} -b`, {
          cwd: join(__dirname, '../../.tmp')
        }, () => {
          expect(readFileSync(join(__dirname, '../../.tmp/dist/deep/index.html'), { encoding: 'utf8' })).to.contain('Secondary - ');
          done();
        });
      });
    });

    describe('compress', function() {
      it('will created compressed versions of files in output dir with -c', function(done) {
        exec(`${join(__dirname, '../../', pkg.bin)} --build`, {
          cwd: join(__dirname, '../../.tmp')
        }, (error, stdout, stderr) => {
          expect(stdout).to.equal('');
          expect(stderr).to.equal('');

          exec(`${join(__dirname, '../../', pkg.bin)} -c`, {
            cwd: join(__dirname, '../../.tmp')
          }, (error, stdout, stderr) => {
            expect(stdout).to.equal('');
            expect(stderr).to.equal('');

            glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
              expect(files).to.deep.equal(expectedAndCompressedFiles('barebones'));
              done();
            });
          });
        });
      });

      it('will created compressed versions of files in output dir with --compress', function(done) {
        exec(`${join(__dirname, '../../', pkg.bin)} --build`, {
          cwd: join(__dirname, '../../.tmp')
        }, (error, stdout, stderr) => {
          expect(stdout).to.equal('');
          expect(stderr).to.equal('');

          exec(`${join(__dirname, '../../', pkg.bin)} --compress`, {
            cwd: join(__dirname, '../../.tmp')
          }, (error, stdout, stderr) => {
            expect(stdout).to.equal('');
            expect(stderr).to.equal('');

            glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
              expect(files).to.deep.equal(expectedAndCompressedFiles('barebones'));
              done();
            });
          });
        });
      });
    });

    describe('watch', function() {
      it('will build and watch files in the provided destination with --watch', function(done) {
        let shuttingDown = false;
        const task = spawn(join(__dirname, '../../', pkg.bin), ['--watch'], {
          cwd: join(__dirname, '../../.tmp')
        });

        task.stdout.on('data', () => {
          if (!shuttingDown) {
            glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
              if (files.toString() === expectedFilesForWatch('barebones').toString()) {
                shuttingDown = true;
                psTree(task.pid, function (err, children) {
                  task.kill();
                  spawn('kill', ['-9'].concat(children.map(process => process.PID)));
                });
              }
            });
          }
        });

        task.on('error', done);

        task.on('close', () => {
          glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
            expect(files).to.deep.equal(expectedFilesForWatch('barebones'));
            done();
          });
        });

        setTimeout(() => {
          psTree(task.pid, function (err, children) {
            task.kill();
            spawn('kill', ['-9'].concat(children.map(process => process.PID)));
          });
        }, 5 * 1000);
      });

      it('will build and watch files in the provided destination with -w', function(done) {
        let shuttingDown = false;
        const task = spawn(join(__dirname, '../../', pkg.bin), ['-w'], {
          cwd: join(__dirname, '../../.tmp')
        });

        task.stdout.on('data', () => {
          if (!shuttingDown) {
            glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
              if (files.toString() === expectedFilesForWatch('barebones').toString()) {
                shuttingDown = true;
                psTree(task.pid, function (err, children) {
                  task.kill();
                  spawn('kill', ['-9'].concat(children.map(process => process.PID)));
                });
              }
            });
          }
        });

        task.on('error', done);

        task.on('close', () => {
          glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
            expect(files).to.deep.equal(expectedFilesForWatch('barebones'));
            done();
          });
        });

        setTimeout(() => {
          psTree(task.pid, function (err, children) {
            task.kill();
            spawn('kill', ['-9'].concat(children.map(process => process.PID)));
          });
        }, 10 * 1000);
      });

      it('will allow access to a static file through the webserver', function(done) {
        const task = spawn(join(__dirname, '../../', pkg.bin), ['-w'], {
          cwd: join(__dirname, '../../.tmp')
        });

        task.stdout.on('data', (data) => {
          const matches = data.toString().match(/Local\: (http\:\/\/localhost\:\d+)/);
          if (matches) {
            get(`${matches[1]}/robots.txt`, response => {
              expect(response.statusCode).to.eq(200);

              psTree(task.pid, function (err, children) {
                task.kill();
                spawn('kill', ['-9'].concat(children.map(process => process.PID)));
              });
            }).on('error', function() {
              psTree(task.pid, function (err, children) {
                task.kill();
                spawn('kill', ['-9'].concat(children.map(process => process.PID)));
              });
            });
          }
        });

        task.on('error', done);

        task.on('close', () => {
          done();
        });

        setTimeout(() => {
          psTree(task.pid, function (err, children) {
            task.kill();
            spawn('kill', ['-9'].concat(children.map(process => process.PID)));
          });
        }, 10 * 1000);
      });
    });
  });

  describe('full-example template', function() {
    beforeEach(loadFixture('full-example'));

    describe('build', function() {
      it('will build files in the provided destination with --build', function(done) {
        exec(`${join(__dirname, '../../', pkg.bin)} --build`, {
          cwd: join(__dirname, '../../.tmp')
        }, (error, stdout, stderr) => {
          expect(stdout).to.equal('');
          expect(stderr).to.equal('');

          glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
            expect(files).to.deep.equal(expectedFiles('full-example'));
            done();
          });
        });
      });

      it('will build files in the provided destination with -b', function(done) {
        exec(`${join(__dirname, '../../', pkg.bin)} -b`, {
          cwd: join(__dirname, '../../.tmp')
        }, (error, stdout, stderr) => {
          expect(stdout).to.equal('');
          expect(stderr).to.equal('');

          glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
            expect(files).to.deep.equal(expectedFiles('full-example'));
            done();
          });
        });
      });

      it('will utilize the custom handlebars helper in slipcast.js', function(done) {
        exec(`${join(__dirname, '../../', pkg.bin)} -b`, {
          cwd: join(__dirname, '../../.tmp')
        }, () => {
          expect(readFileSync(join(__dirname, '../../.tmp/dist/deep/index.html'), { encoding: 'utf8' })).to.contain('GOING DEEP');
          done();
        });
      });

      it('will use the secondary.hbs layout for deep/index.html', function(done) {
        exec(`${join(__dirname, '../../', pkg.bin)} -b`, {
          cwd: join(__dirname, '../../.tmp')
        }, () => {
          expect(readFileSync(join(__dirname, '../../.tmp/dist/deep/index.html'), { encoding: 'utf8' })).to.contain('Secondary - ');
          done();
        });
      });

      it('will show custom metalsmith plugin metadata', function(done) {
        exec(`${join(__dirname, '../../', pkg.bin)} -b`, {
          cwd: join(__dirname, '../../.tmp')
        }, () => {
          expect(readFileSync(join(__dirname, '../../.tmp/dist/deep/index.html'), { encoding: 'utf8' })).to.contain('I am deep/index.hbs');
          done();
        });
      });
    });

    describe('compress', function() {
      it('will created compressed versions of files in output dir with -c', function(done) {
        exec(`${join(__dirname, '../../', pkg.bin)} --build`, {
          cwd: join(__dirname, '../../.tmp')
        }, (error, stdout, stderr) => {
          expect(stdout).to.equal('');
          expect(stderr).to.equal('');

          exec(`${join(__dirname, '../../', pkg.bin)} -c`, {
            cwd: join(__dirname, '../../.tmp')
          }, (error, stdout, stderr) => {
            expect(stdout).to.equal('');
            expect(stderr).to.equal('');

            glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
              expect(files).to.deep.equal(expectedAndCompressedFiles('full-example'));
              done();
            });
          });
        });
      });

      it('will created compressed versions of files in output dir with --compress', function(done) {
        exec(`${join(__dirname, '../../', pkg.bin)} --build`, {
          cwd: join(__dirname, '../../.tmp')
        }, (error, stdout, stderr) => {
          expect(stdout).to.equal('');
          expect(stderr).to.equal('');

          exec(`${join(__dirname, '../../', pkg.bin)} --compress`, {
            cwd: join(__dirname, '../../.tmp')
          }, (error, stdout, stderr) => {
            expect(stdout).to.equal('');
            expect(stderr).to.equal('');

            glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
              expect(files).to.deep.equal(expectedAndCompressedFiles('full-example'));
              done();
            });
          });
        });
      });
    });

    describe('watch', function() {
      it('will build and watch files in the provided destination with --watch', function(done) {
        let shuttingDown = false;
        const task = spawn(join(__dirname, '../../', pkg.bin), ['--watch'], {
          cwd: join(__dirname, '../../.tmp')
        });

        task.stdout.on('data', () => {
          if (!shuttingDown) {
            glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
              if (files.toString() === expectedFilesForWatch('full-example').toString()) {
                shuttingDown = true;
                psTree(task.pid, function (err, children) {
                  task.kill();
                  spawn('kill', ['-9'].concat(children.map(process => process.PID)));
                });
              }
            });
          }
        });

        task.on('error', done);

        task.on('close', () => {
          glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
            expect(files).to.deep.equal(expectedFilesForWatch('full-example'));
            done();
          });
        });

        setTimeout(() => {
          psTree(task.pid, function (err, children) {
            task.kill();
            spawn('kill', ['-9'].concat(children.map(process => process.PID)));
          });
        }, 5 * 1000);
      });

      it('will build and watch files in the provided destination with -w', function(done) {
        let shuttingDown = false;
        const task = spawn(join(__dirname, '../../', pkg.bin), ['-w'], {
          cwd: join(__dirname, '../../.tmp')
        });

        task.stdout.on('data', () => {
          if (!shuttingDown) {
            glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
              if (files.toString() === expectedFilesForWatch('full-example').toString()) {
                shuttingDown = true;
                psTree(task.pid, function (err, children) {
                  task.kill();
                  spawn('kill', ['-9'].concat(children.map(process => process.PID)));
                });
              }
            });
          }
        });

        task.on('error', done);

        task.on('close', () => {
          glob(join(__dirname, '../../.tmp/dist', '**/*'), null, function (error, files) {
            expect(files).to.deep.equal(expectedFilesForWatch('full-example'));
            done();
          });
        });

        setTimeout(() => {
          psTree(task.pid, function (err, children) {
            task.kill();
            spawn('kill', ['-9'].concat(children.map(process => process.PID)));
          });
        }, 10 * 1000);
      });

      it('will allow access to a static file through the webserver', function(done) {
        const task = spawn(join(__dirname, '../../', pkg.bin), ['-w'], {
          cwd: join(__dirname, '../../.tmp')
        });

        task.stdout.on('data', (data) => {
          const matches = data.toString().match(/Local\: (http\:\/\/localhost\:\d+)/);
          if (matches) {
            get(`${matches[1]}/robots.txt`, response => {
              expect(response.statusCode).to.eq(200);

              psTree(task.pid, function (err, children) {
                task.kill();
                spawn('kill', ['-9'].concat(children.map(process => process.PID)));
              });
            }).on('error', function() {
              psTree(task.pid, function (err, children) {
                task.kill();
                spawn('kill', ['-9'].concat(children.map(process => process.PID)));
              });
            });
          }
        });

        task.on('error', done);

        task.on('close', () => {
          done();
        });

        setTimeout(() => {
          psTree(task.pid, function (err, children) {
            task.kill();
            spawn('kill', ['-9'].concat(children.map(process => process.PID)));
          });
        }, 10 * 1000);
      });
    });
  });
});
