const config = require('../../config');
const { readdirSync, statSync } = require('fs');
const { extname, join } = require('path');

function getFileExtensions(directory, files) {
  files = files || [];
  readdirSync(directory).forEach(path => {
    if (statSync(join(directory, path)).isDirectory()) {
      files = getFileExtensions(join(directory, path), files);
    } else {
      const extension = extname(path);
      files.push(extension[0] === '.' ? extension.substr(1) : extension);
    }
  });
  return files;
}

const extensions = getFileExtensions(config.folders.static);
const staticExtensions = extensions.filter((value, index) => {
  return extensions.indexOf(value) === index;
});

module.exports = `# Procfile created by Static
css: ${require.resolve('nodemon/bin/nodemon')} --ext css --exec "${join(__dirname, '../../../bin/build-css.js')}" --watch ${config.folders.css}
html: ${require.resolve('nodemon/bin/nodemon')} --ext hbs --exec "${join(__dirname, '../../../bin/build-html.js')}" --watch ${config.folders.pages} --watch ${config.folders.views}
js: ${require.resolve('nodemon/bin/nodemon')} --exec "${join(__dirname, '../../../bin/build-js.js')}" --watch ${config.folders.javascript}
server: ${require.resolve('browser-sync/bin/browser-sync')} start --config ${join(__dirname, '../../../config/browsersync.js')}
static: ${require.resolve('nodemon/bin/nodemon')} --ext ${staticExtensions.join(',')} --exec "${join(__dirname, '../../../bin/copy-static.js')}" --watch ${config.folders.static}
`;
