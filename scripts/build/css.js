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

config.files.filter(file => file.endsWith('.css') || file.endsWith('.scss'))
  .forEach((file) => {
    const cssFilePath = join(config.output, file.replace(extname(file), '.css'));

    return new Promise((resolve, reject) => {
      readFile(join(config.folders.css, file), {
        encoding: 'utf8',
      }, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    }).then((css) => {
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
            sourceMapRoot: relative(config.folders.css, config.output),
          });
        } catch (error) {
          console.error(error);
        }
      }
      return css;
    }, (error) => {
      console.error(error);
    }).then((css) => {
      const plugins = [
        cssImport(),
        cssnext({
          browsers: ['last 2 versions'],
        }),
      ];

      if (process.env.NODE_ENV === 'production') {
        plugins.push(cssnano({
          autoprefixer: false,
          discardComments: {
            removeAll: true,
          },
        }));
      }

      return postcss(plugins).process(typeof css === 'object' ? css.css : css, {
        from: join(config.folders.css, file),
        to: join(config.output, file),
        map: {
          inline: false,
        },
      }).catch((error) => {
        console.error(error);
      });
    }, (error) => {
      console.error(error);
    }).then((result) => {
      ensureDir(dirname(cssFilePath), (error) => {
        if (error) {
          throw error;
        }

        writeFile(cssFilePath, result.css, (err) => {
          if (err) {
            throw err;
          }
        });

        if (result.map) {
          writeFile(`${join(config.output, file)}.map`, result.map, (err) => {
            if (err) {
              throw err;
            }
          });
        }
      });
    })
    .catch((error) => {
      console.error(error);
    });
  });
