'use strict';

const help = require('../../../global-cli/lib/help');
const { expect } = require('chai');
const { describe, it } = require('mocha');
const pkg = require('../../../global-cli/package.json');

describe('help', function() {
  it('will return a string', function() {
    expect(help()).to.be.a('string');
  });

  it('will contain the cli version number', function() {
    expect(help()).to.contain(pkg.version);
  });
});
