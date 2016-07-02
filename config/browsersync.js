const config = require('../lib/config');
const { join } = require('path');

module.exports = {
  files: [join(config.output, '**','*.{css,jpg,js,png,svg}')],
  open: false,
  server: config.output
};
