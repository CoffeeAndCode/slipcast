const { join } = require('path');

const config = require(join(process.cwd(), 'slipcast'));

module.exports = Object.assign({
  build: {
    plugins: []
  }
}, config);
