'use strict';

const config = require('../../config/slipcast');
const { ensureDir } = require('fs-extra');
const postcss = require('postcss');
const cssImport = require('postcss-import');
const cssnano = require('cssnano');
const cssnext = require('postcss-cssnext');
const { readFile, writeFile } = require('fs');
const { dirname, extname, join, relative } = require('path');
const sass = require('node-sass');

config.files.filter(file => {
  return file.endsWith('.css') || file.endsWith('.scss');
}).forEach(file => {
  const cssFilePath = join(config.output, file.replace(extname(file), '.css'));

  return new Promise((resolve, reject) => {
    readFile(join(config.folders.css, file), { encoding: 'utf8' }, (err, data) => {
      if (err) { reject(err); }
      resolve(data);
    });
  }).then(function(css) {
    if (file.endsWith('.scss')) {
      try {
        return sass.renderSync({
          data: css,
          file: join(config.folders.css, file),
          includePaths: ['node_modules'],
          outFile: cssFilePath,
          sourceMap: true,
          sourceMapContents: true,
          sourceMapEmbed: true,
          sourceMapRoot: relative(config.folders.css, config.output)
        });
      } catch(error) {
        console.error(error);
      }
    }
    return css;
  }, function(error) { console.error(error); }).then(function(css) {
    const plugins = [
      cssImport(),
      cssnext({ browsers: ['last 2 versions'] })
    ];

    if (process.env.NODE_ENV === 'production') {
      plugins.push(cssnano({
        autoprefixer: false,
        discardComments: { removeAll: true }
      }));
    }

    return postcss(plugins).process(typeof css === 'object' ? css.css : css, {
      from: join(config.folders.css, file),
      to: join(config.output, file),
      map: { inline: false }
    }).catch(function(error) {
      console.error(error);
    });
  }, function(error) { console.error(error); }).then(function (result) {
    ensureDir(dirname(cssFilePath), function (error) {
      if (error) { throw error; }

      writeFile(cssFilePath, result.css, error => {
        if (error) { throw error; }
      });

      if (result.map) {
        writeFile(`${join(config.output, file)}.map`, result.map, error => {
          if (error) { throw error; }
        });
      }
    });
  }).catch(function(error) {
    console.error(error);
  });
});
