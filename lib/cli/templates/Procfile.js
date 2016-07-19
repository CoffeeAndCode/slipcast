const config = require('../../config');
const { join } = require('path');

module.exports = `# Procfile created by Slipcast
css: ${require.resolve('nodemon/bin/nodemon')} --ext css --exec "${join(__dirname, '../../../bin/build-css.js')}" --watch ${config.folders.css}
html: ${require.resolve('nodemon/bin/nodemon')} --ext hbs --exec "${join(__dirname, '../../../bin/build-html.js')}" --watch ${config.folders.pages} --watch ${config.folders.views}
js: ${require.resolve('nodemon/bin/nodemon')} --exec "${join(__dirname, '../../../bin/build-js.js')}" --watch ${config.folders.javascript}
server: ${require.resolve('browser-sync/bin/browser-sync')} start --config ${join(__dirname, '../../../config/browsersync.js')}
`;
