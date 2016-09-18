'use strict';

const createApp = require('../../../global-cli/lib/createApp');
const { expect } = require('chai');
const { afterEach, describe, it } = require('mocha');
const { basename } = require('path');
const { clean } = require('../../support/fixtures');
const { ensureDirSync } = require('fs-extra');

describe('createApp', function() {
  afterEach(clean);

  describe('directory already exists', function() {
    it('will show an error message', function(done) {
      ensureDirSync('.tmp');

      createApp({
        callback: function(error) {
          if (error) {
            expect(error.message).to.eq('The directory `.tmp` already exists. Aborting.');
            done();
          }
        },
        destination: '.tmp',
        log: function(){}
      });
    });

    it('will show an error message using relative path', function(done) {
      ensureDirSync('.tmp');

      createApp({
        callback: function(error) {
          if (error) {
            expect(error.message).to.eq('The directory `../slipcast/.tmp` already exists. Aborting.');
            done();
          }
        },
        destination: `../${basename(process.cwd())}/.tmp`,
        log: function(){}
      });
    });

    it('will show an error message using deep path', function(done) {
      ensureDirSync('.tmp/example/deep');

      createApp({
        callback: function(error) {
          if (error) {
            expect(error.message).to.eq('The directory `.tmp/example/deep` already exists. Aborting.');
            done();
          }
        },
        destination: `.tmp/example/deep`,
        log: function(){}
      });
    });
  });
});
