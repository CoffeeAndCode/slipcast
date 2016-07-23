'use strict';

const config = require('../../config/slipcast');
const postcss = require('postcss');
const cssImport = require('postcss-import');
const cssnano = require('cssnano');
const cssnext = require('postcss-cssnext');
const mkdirp = require('mkdirp');
const { readFile, writeFile } = require('fs');
const { dirname, join } = require('path');

config.files.filter(file => {
  return file.endsWith('.css');
}).forEach(file => {
  return new Promise((resolve, reject) => {
    readFile(join(config.folders.css, file), { encoding: 'utf8' }, (err, data) => {
      if (err) { reject(err); }
      resolve(data);
    });
  }).then(function(css) {
    const plugins = [
      cssImport(),
      cssnext({ browsers: ['last 2 versions'] })
    ];

    if (process.env.NODE_ENV === 'production') {
      plugins.push(cssnano({
        discardComments: { removeAll: true }
      }));
    }

    return postcss(plugins).process(css, {
      from: join(config.folders.css, file),
      to: join(config.output, file),
      map: { inline: false }
    }).catch(error => {
      throw error;
    });
  }).then(function (result) {
    const cssFilePath = join(config.output, file);

    mkdirp(dirname(cssFilePath), function (error) {
      if (error) { throw error; }

      writeFile(cssFilePath, result.css, error => {
        if (error) { throw error; }
      });

      if (result.map) {
        writeFile(`${cssFilePath}.map`, result.map, error => {
          if (error) { throw error; }
        });
      }
    });
  }).catch(function (error) {
    throw error;
  });
});
