const createApp = require('../../../global-cli/lib/createApp');
const { expect } = require('chai');
const { afterEach, describe, it } = require('mocha');
const { basename } = require('path');
const { clean } = require('../../support/fixtures');
const { ensureDirSync } = require('fs-extra');

describe('createApp', () => {
  afterEach(clean);

  describe('directory already exists', () => {
    it('will show an error message', (done) => {
      ensureDirSync('.tmp');

      createApp({
        callback: (error) => {
          if (error) {
            expect(error.message).to.eq('The directory `.tmp` already exists. Aborting.');
            done();
          }
        },
        destination: '.tmp',
        log: () => {},
      });
    });

    it('will show an error message using relative path', (done) => {
      ensureDirSync('.tmp');

      createApp({
        callback: (error) => {
          if (error) {
            expect(error.message).to.eq('The directory `../slipcast/.tmp` already exists. Aborting.');
            done();
          }
        },
        destination: `../${basename(process.cwd())}/.tmp`,
        log: () => {},
      });
    });

    it('will show an error message using deep path', (done) => {
      ensureDirSync('.tmp/example/deep');

      createApp({
        callback: (error) => {
          if (error) {
            expect(error.message).to.eq('The directory `.tmp/example/deep` already exists. Aborting.');
            done();
          }
        },
        destination: '.tmp/example/deep',
        log: () => {},
      });
    });
  });
});
