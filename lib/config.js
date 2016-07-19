const { readFileSync } = require('fs');
const { join } = require('path');

const configPath = join(process.cwd(), 'slipcast.json');

module.exports = JSON.parse(readFileSync(configPath, { encoding: 'utf-8' }));
