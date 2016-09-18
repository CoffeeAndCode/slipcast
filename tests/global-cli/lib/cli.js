'use strict';

const concat = require('concat-stream');
const pkg = require('../../../global-cli/package.json');
const proxyquire = require('proxyquire');
const { expect } = require('chai');
const { describe, it } = require('mocha');
const { PassThrough } = require('stream');

const CLI = proxyquire('../../../global-cli/lib/cli', {
  './createApp': function(options) { options.callback(null, options); },
  './help': function() { return 'help stub'; }
});

describe('cli', function() {
  describe('help', function() {
    const expectHelpOutputForArgs = function(argv) {
      return new Promise(resolve => {
        const stdout = new PassThrough();
        const cli = new CLI({
          argv: argv,
          stdin: new PassThrough(),
          stdout: stdout,
          stderr: new PassThrough()
        });

        cli.run(function() {
          stdout.end();
        });

        stdout.pipe(concat(function(output) {
          expect(output.toString('utf8').trim()).to.contain('help stub');
          resolve();
        }));
      });
    }

    it('will be displayed if nothing passed', function() {
      return expectHelpOutputForArgs([]);
    });

    it('will be displayed if --help passed', function() {
      return expectHelpOutputForArgs(['--help']);
    });

    it('will be displayed if -h passed', function() {
      return expectHelpOutputForArgs(['-h']);
    });
  });

  describe('version', function() {
    const expectVersionOutputForArgs = function(argv) {
      return new Promise(resolve => {
        const stdout = new PassThrough();
        const cli = new CLI({
          argv: argv,
          stdin: new PassThrough(),
          stdout: stdout,
          stderr: new PassThrough()
        });

        cli.run(function() {
          stdout.end();
        });

        stdout.pipe(concat(function(output) {
          expect(output.toString('utf8').trim()).to.eq(pkg.version);
          resolve();
        }));
      });
    }

    it('will be displayed if --version passed', function() {
      return expectVersionOutputForArgs(['--version']);
    });

    it('will be displayed if -v passed', function() {
      return expectVersionOutputForArgs(['-v']);
    });
  });

  describe('createApp', function() {
    it('will run if passed a path', function(done) {
      const cli = new CLI({
        argv: ['some/new/folder'],
        stdin: new PassThrough(),
        stdout: new PassThrough(),
        stderr: new PassThrough()
      });

      cli.run(function(error, options) {
        expect(options.destination).to.be.eq('some/new/folder');
        done();
      });
    });

    it('will be passed the verbose flag', function(done) {
      const cli = new CLI({
        argv: ['some/new/folder', '--verbose'],
        stdin: new PassThrough(),
        stdout: new PassThrough(),
        stderr: new PassThrough()
      });

      cli.run(function(error, options) {
        expect(options.verbose).to.be.eq(true);
        done();
      });
    });

    it('will be passed the node_modules flag', function(done) {
      const cli = new CLI({
        argv: ['some/new/folder', '--node_modules', 'blah/blah'],
        stdin: new PassThrough(),
        stdout: new PassThrough(),
        stderr: new PassThrough()
      });

      cli.run(function(error, options) {
        expect(options.nodeModules).to.be.eq('blah/blah');
        done();
      });
    });

    it('will be passed stdio from the CLI', function(done) {
      const stdio = [
        new PassThrough(),
        new PassThrough(),
        new PassThrough()
      ];
      const cli = new CLI({
        argv: ['some/new/folder'],
        stdin: stdio[0],
        stdout: stdio[1],
        stderr: stdio[2]
      });

      cli.run(function(error, options) {
        expect(options.stdio).to.have.members(stdio);
        done();
      });
    });

    it('will be passed a log method that uses stdout from CLI', function(done) {
      const stdout = new PassThrough();
      const cli = new CLI({
        argv: ['some/new/folder'],
        stdin: new PassThrough(),
        stdout: stdout,
        stderr: new PassThrough()
      });

      cli.run(function(error, options) {
        options.log('hello world');
        stdout.end();
      });

      stdout.pipe(concat(function(output) {
        expect(output.toString('utf8').trim()).to.eq('hello world');
        done();
      }));
    });
  });
});
