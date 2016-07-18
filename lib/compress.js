const { readFile, writeFile } = require('fs');
const zlib = require('zlib');

module.exports = function(filename) {
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
