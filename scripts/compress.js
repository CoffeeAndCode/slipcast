#!/usr/bin/env node

const compress = require('../lib/compress');
const config = require('../lib/config');
const glob = require('glob');

glob(`${config.output}/**/*.{css,html,ico,jpg,jpeg,js,json,png,rss,xml}`, null, function (error, files) {
  if (error) { throw error; }
  files.forEach(compress);
});
