'use strict';

const promisify = require('es6-promisify');
const { afterEach, beforeEach, describe, it } = require('mocha');
const { expect } = require('chai');
const { exec, spawn } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const { ensureDirSync, removeSync } = require('fs-extra');
const glob = promisify(require('glob'));
const { get } = require('http');
const init = require('../../scripts/init');
const { clean, expectedAndCompressedFiles, expectedFiles, expectedFilesForWatch, loadFixture } = require('../support/fixtures');
const { runFromDirectory } = require('../support/process');
const { join } = require('path');
const pkg = require('../../package.json');
const psTree = require('ps-tree');

describe('CLI', function() {
  this.slow(2 * 1000);
  this.timeout(parseInt(process.env.TEST_TIMEOUT, 10) || 20 * 1000);
  afterEach(clean);

  describe('template without config', function() {
    beforeEach(loadFixture('barebones'));
    beforeEach(function() {
      removeSync(join(__dirname, '../../.tmp/slipcast.js'));
    });

    it('will show an error if slipcast.js cannot be found for build command', function(done) {
      exec(`${join(__dirname, '../../', pkg.bin)} --build`, {
        cwd: join(__dirname, '../../.tmp')
      }, (error, stdout, stderr) => {
        expect(stdout).to.equal('');
        expect(stderr).to.contain("We could not find a slipcast.js file for your project. Are you in the right directory?\n");
        done();
      });
    });

    it('will show an error if slipcast.js cannot be found for compile command', function(done) {
      exec(`${join(__dirname, '../../', pkg.bin)} --compile`, {
        cwd: join(__dirname, '../../.tmp')
      }, (error, stdout, stderr) => {
        expect(stdout).to.equal('');
        expect(stderr).to.contain("We could not find a slipcast.js file for your project. Are you in the right directory?\n");
        done();
      });
    });

    it('will show an error if slipcast.js cannot be found for watch command', function(done) {
      exec(`${join(__dirname, '../../', pkg.bin)} --watch`, {
        cwd: join(__dirname, '../../.tmp')
      }, (error, stdout, stderr) => {
        expect(stdout).to.equal('');
        expect(stderr).to.contain("We could not find a slipcast.js file for your project. Are you in the right directory?\n");
        done();
      });
    });
  });

  describe('init', function() {
    beforeEach(function() {
      ensureDirSync(join(__dirname, '../../.tmp/'));
      const packageJson = {
        name: 'example',
        version: '0.0.1',
        private: true,
        dependencies: {
          slipcast: require(join(__dirname, '../../package.json')).version
        }
      };
      writeFileSync(join(__dirname, '../../.tmp/package.json'), JSON.stringify(packageJson, null, 2));
    });

    it('will create a fresh project in the folder specified', function(done) {
      runFromDirectory(join(__dirname, '../../.tmp'), done, function(done) {
        init('.tmp', 'app-name', false).then(() => {
          Promise.all([
            glob(join(__dirname, '../../template', '**/*')),
            glob(join(process.cwd(), '**/*'))
          ]).then(results => {
            // Resulting folder has a package.json so adjust count by 1
            // when comparing the total number of files in each directory.
            expect(results[0].length + 1).to.eq(results[1].length);
            done();
          }).catch(done);
        }).catch(done);
      });
    });
  });

  describe('barebones template', function() {
    beforeEach(loadFixture('barebones'));

    describe('build', function() {
      it('will build files in the provided destination with --build', function(done) {
        exec(`${join(__dirname, '../../', pkg.bin)} --build`, {
          cwd: join(__dirname, '../../.tmp')
        }, (error, stdout, stderr) => {
          expect(stdout).to.equal('');
          expect(stderr).to.equal('');

          glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
            expect(files).to.deep.equal(expectedFiles('barebones'));
            done();
          }).catch(done);
        });
      });

      it('will build files in the provided destination with -b', function(done) {
        exec(`${join(__dirname, '../../', pkg.bin)} -b`, {
          cwd: join(__dirname, '../../.tmp')
        }, (error, stdout, stderr) => {
          expect(stdout).to.equal('');
          expect(stderr).to.equal('');

          glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
            expect(files).to.deep.equal(expectedFiles('barebones'));
            done();
          }).catch(done);
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

            glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
              expect(files).to.deep.equal(expectedAndCompressedFiles('barebones'));
              done();
            }).catch(done);
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

            glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
              expect(files).to.deep.equal(expectedAndCompressedFiles('barebones'));
              done();
            }).catch(done);
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
            glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
              if (files.toString() === expectedFilesForWatch('barebones').toString()) {
                shuttingDown = true;
                psTree(task.pid, function (err, children) {
                  task.kill();
                  spawn('kill', ['-9'].concat(children.map(process => process.PID)));
                });
              }
            }).catch(done);
          }
        });

        task.on('error', done);

        task.on('close', () => {
          glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
            expect(files).to.deep.equal(expectedFilesForWatch('barebones'));
            done();
          }).catch(done);
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
            glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
              if (files.toString() === expectedFilesForWatch('barebones').toString()) {
                shuttingDown = true;
                psTree(task.pid, function (err, children) {
                  task.kill();
                  spawn('kill', ['-9'].concat(children.map(process => process.PID)));
                });
              }
            }).catch(done);
          }
        });

        task.on('error', done);

        task.on('close', () => {
          glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
            expect(files).to.deep.equal(expectedFilesForWatch('barebones'));
            done();
          }).catch(done);
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

          glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
            expect(files).to.deep.equal(expectedFiles('full-example'));
            done();
          }).catch(done);
        });
      });

      it('will build files in the provided destination with -b', function(done) {
        exec(`${join(__dirname, '../../', pkg.bin)} -b`, {
          cwd: join(__dirname, '../../.tmp')
        }, (error, stdout, stderr) => {
          expect(stdout).to.equal('');
          expect(stderr).to.equal('');

          glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
            expect(files).to.deep.equal(expectedFiles('full-example'));
            done();
          }).catch(done);
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

            glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
              expect(files).to.deep.equal(expectedAndCompressedFiles('full-example'));
              done();
            }).catch(done);
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

            glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
              expect(files).to.deep.equal(expectedAndCompressedFiles('full-example'));
              done();
            }).catch(done);
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
            glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
              if (files.toString() === expectedFilesForWatch('full-example').toString()) {
                shuttingDown = true;
                psTree(task.pid, function (err, children) {
                  task.kill();
                  spawn('kill', ['-9'].concat(children.map(process => process.PID)));
                });
              }
            }).catch(done);
          }
        });

        task.on('error', done);

        task.on('close', () => {
          glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
            expect(files).to.deep.equal(expectedFilesForWatch('full-example'));
            done();
          }).catch(done);
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
            glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
              if (files.toString() === expectedFilesForWatch('full-example').toString()) {
                shuttingDown = true;
                psTree(task.pid, function (err, children) {
                  task.kill();
                  spawn('kill', ['-9'].concat(children.map(process => process.PID)));
                });
              }
            }).catch(done);
          }
        });

        task.on('error', done);

        task.on('close', () => {
          glob(join(__dirname, '../../.tmp/dist', '**/*')).then(files => {
            expect(files).to.deep.equal(expectedFilesForWatch('full-example'));
            done();
          }).catch(done);
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
