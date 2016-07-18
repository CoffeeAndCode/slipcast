const { readFileSync } = require('fs');
const { join } = require('path');
const { version } = require('../../package.json');

module.exports = function() {
  const help = readFileSync(join(__dirname, '../../help.md'), { encoding: 'utf-8' });
  return help.replace('__VERSION__', version);
};
