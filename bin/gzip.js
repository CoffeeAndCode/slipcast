#!/usr/bin/env node

const config = require('../lib/config');
const glob = require('glob');
const { readFile, writeFile } = require('fs');
const zlib = require('zlib');

glob(`${config.output}/**/*.{css,html,ico,jpg,jpeg,js,json,png,rss,xml}`, null, function (error, files) {
  if (error) { throw error; }
  files.forEach(processFile);
});

function processFile(filename) {
  console.log(` ${filename}`);

  readFile(filename, {encoding: 'utf8'}, (error, content) => {
    if (error) { throw error; }

    zlib.gzip(content, function(error, compressed) {
      if (error) { throw error; }

      writeFile(`${filename}.gz`, compressed, error => {
        if (error) { throw error; }
      });
    });
  });
}
