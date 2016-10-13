'use strict';

const concat = require('concat-stream');
const pkg = require('../../../global-cli/package.json');
const proxyquire = require('proxyquire');
const { expect } = require('chai');
const { describe, it } = require('mocha');
const { PassThrough } = require('stream');

const CLI = proxyquire('../../../global-cli/lib/cli', {
  './createApp': (options) => {
    options.callback(null, options);
  },
  './help': () => 'help stub',
});

describe('cli', () => {
  describe('help', () => {
    const expectHelpOutputForArgs = argv =>
      new Promise((resolve) => {
        const stdout = new PassThrough();
        const cli = new CLI({
          argv,
          stdin: new PassThrough(),
          stdout,
          stderr: new PassThrough(),
        });

        cli.run(() => {
          stdout.end();
        });

        stdout.pipe(concat((output) => {
          expect(output.toString('utf8').trim()).to.contain('help stub');
          resolve();
        }));
      });

    it('will be displayed if nothing passed', () => expectHelpOutputForArgs([]));

    it('will be displayed if --help passed', () => expectHelpOutputForArgs(['--help']));

    it('will be displayed if -h passed', () => expectHelpOutputForArgs(['-h']));
  });

  describe('version', () => {
    const expectVersionOutputForArgs = argv =>
      new Promise((resolve) => {
        const stdout = new PassThrough();
        const cli = new CLI({
          argv,
          stdin: new PassThrough(),
          stdout,
          stderr: new PassThrough(),
        });

        cli.run(() => {
          stdout.end();
        });

        stdout.pipe(concat((output) => {
          expect(output.toString('utf8').trim()).to.eq(pkg.version);
          resolve();
        }));
      });


    it('will be displayed if --version passed', () => expectVersionOutputForArgs(['--version']));

    it('will be displayed if -v passed', () => expectVersionOutputForArgs(['-v']));
  });

  describe('createApp', () => {
    it('will run if passed a path', (done) => {
      const cli = new CLI({
        argv: ['some/new/folder'],
        stdin: new PassThrough(),
        stdout: new PassThrough(),
        stderr: new PassThrough(),
      });

      cli.run((error, options) => {
        expect(options.destination).to.be.eq('some/new/folder');
        done();
      });
    });

    it('will be passed the verbose flag', (done) => {
      const cli = new CLI({
        argv: ['some/new/folder', '--verbose'],
        stdin: new PassThrough(),
        stdout: new PassThrough(),
        stderr: new PassThrough(),
      });

      cli.run((error, options) => {
        expect(options.verbose).to.be.eq(true);
        done();
      });
    });

    it('will be passed stdio from the CLI', (done) => {
      const stdio = [
        new PassThrough(),
        new PassThrough(),
        new PassThrough(),
      ];
      const cli = new CLI({
        argv: ['some/new/folder'],
        stdin: stdio[0],
        stdout: stdio[1],
        stderr: stdio[2],
      });

      cli.run((error, options) => {
        expect(options.stdio).to.have.members(stdio);
        done();
      });
    });

    it('will be passed a log method that uses stdout from CLI', (done) => {
      const stdout = new PassThrough();
      const cli = new CLI({
        argv: ['some/new/folder'],
        stdin: new PassThrough(),
        stdout,
        stderr: new PassThrough(),
      });

      cli.run((error, options) => {
        options.log('hello world');
        stdout.end();
      });

      stdout.pipe(concat((output) => {
        expect(output.toString('utf8').trim()).to.eq('hello world');
        done();
      }));
    });
  });
});
