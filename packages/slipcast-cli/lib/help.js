'use strict';

const pkg = require('../package.json');

module.exports = () => {
  const { version } = pkg;

  return `
 _______  ___      ___   _______  _______  _______  _______  _______
|       ||   |    |   | |       ||       ||   _   ||       ||       |
|  _____||   |    |   | |    _  ||       ||  |_|  ||  _____||_     _|
| |_____ |   |    |   | |   |_| ||       ||       || |_____   |   |
|_____  ||   |___ |   | |    ___||      _||       ||_____  |  |   |
 _____| ||       ||   | |   |    |     |_ |   _   | _____| |  |   |
|_______||_______||___| |___|    |_______||__| |__||_______|  |___|

A minimal config static website builder you can leave at anytime. (v${version})
===========================================================================

Usage: slipcast [options] <new-project-directory>

Basic options:

-h, --help               Show this help message
-v, --version            Show version number of slipcast-cli
    --verbose            Show more information about new project creation
`;
};
