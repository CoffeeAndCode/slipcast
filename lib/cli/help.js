module.exports = function() {
  const { version } = require('../../package.json');

  return String.raw`
 _______  ___      ___   _______  _______  _______  _______  _______
|       ||   |    |   | |       ||       ||   _   ||       ||       |
|  _____||   |    |   | |    _  ||       ||  |_|  ||  _____||_     _|
| |_____ |   |    |   | |   |_| ||       ||       || |_____   |   |
|_____  ||   |___ |   | |    ___||      _||       ||_____  |  |   |
 _____| ||       ||   | |   |    |     |_ |   _   | _____| |  |   |
|_______||_______||___| |___|    |_______||__| |__||_______|  |___|

A static site builder built on Metalsmith, PostCSS, and Rollup.js. (v${version})
===========================================================================

Usage: slipcast [options]

Basic options:

-b, --build              Build all project files and exit
-c, --compress           Compress the files in the output directory
-h, --help               Show this help message
-v, --version            Show version number
-w, --watch              Start a webserver and watch files for changes
`;
};
