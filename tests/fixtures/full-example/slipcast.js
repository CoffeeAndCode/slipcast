// Example of registering an example Handlebars helper.
const handlebars = require('handlebars');
handlebars.registerHelper({
  capitalize: val => val.toUpperCase(),

  // We need a Handlebars helper to retrieve the data from metalsmith.
  pageSpecificMessage: options => {
    return new handlebars.SafeString(options.data.root.pageSpecificMessage);
  }
});

module.exports = {
  build: {
    html: {
      // Need to add custom metadata before plugins run so it's available
      // for Handlebars rendering of pages.
      beforePlugins: [
        function(files, metalsmith, done) {
          Object.keys(files).forEach(file => {
            files[file].pageSpecificMessage = `I am ${file}`;
          })
          done();
        }
      ]
    }
  },
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
