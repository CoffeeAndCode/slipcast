const config = require('../config/slipcast');
const { readFile, writeFile } = require('fs');
const glob = require('glob');
const zlib = require('zlib');

module.exports = () => {
  function compress(filename) {
    readFile(filename, {
      encoding: 'utf8',
    }, (error, content) => {
      if (error) {
        throw error;
      }

      zlib.gzip(content, (zipErr, compressed) => {
        if (zipErr) {
          throw zipErr;
        }

        writeFile(`${filename}.gz`, compressed, (wrtError) => {
          if (wrtError) {
            throw wrtError;
          }
        });
      });
    });
  }

  glob(`${config.output}/**/*.{css,html,ico,jpg,jpeg,js,json,png,rss,xml}`, null, (error, files) => {
    if (error) {
      throw error;
    }
    files.forEach(compress);
  });
};
