'use strict';

const config = require('../config/slipcast');
const { readFile, writeFile } = require('fs');
const glob = require('glob');
const zlib = require('zlib');

module.exports = function() {
  glob(`${config.output}/**/*.{css,html,ico,jpg,jpeg,js,json,png,rss,xml}`, null, function (error, files) {
    if (error) { throw error; }
    files.forEach(compress);
  });

  function compress(filename) {
    readFile(filename, { encoding: 'utf8' }, (error, content) => {
      if (error) { throw error; }

      zlib.gzip(content, function(error, compressed) {
        if (error) { throw error; }

        writeFile(`${filename}.gz`, compressed, error => {
          if (error) { throw error; }
        });
      });
    });
  }
}
