'use strict';

const { commandExists } = require('../../../global-cli/lib/platform');
const { expect } = require('chai');
const { describe, it } = require('mocha');

describe('commandExists', () => {
  it('returns a promise', () => {
    expect(commandExists('node')).to.be.a('promise');
  });

  it('resolves to true if command is present', () =>
    commandExists('node').then((result) => {
      expect(result).to.eq(true);
    })
  );

  it('resolves to false if command is not present', () =>
    commandExists('made-up-command-that-does-not-exist').then((result) => {
      expect(result).to.eq(false);
    })
  );
});
