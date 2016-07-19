// Example of registering an example Handlebars helper.
const handlebars = require('handlebars');
handlebars.registerHelper('capitalize', val => val.toUpperCase());

module.exports = {
  files: [
    'application.css',
    'application.js'
  ],
  folders: {
    css: 'app/css',
    javascript: 'app/js',
    pages: 'app/pages',
    static: 'app/static',
    views: 'app/views'
  },
  output: 'dist'
};
