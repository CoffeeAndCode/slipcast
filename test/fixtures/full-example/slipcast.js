module.exports = {
  build: {
    html: {
      // Need to add custom metadata before plugins run so it's available
      // for Handlebars rendering of pages.
      beforePlugins: [
        (files, metalsmith, done) => {
          Object.keys(files).forEach((file) => {
            files[file].pageSpecificMessage = `I am ${file}`; // eslint-disable-line no-param-reassign
          });
          done();
        },
      ],
    },
  },
  files: [
    'application.css',
    'application.js',
  ],
  folders: {
    css: 'app/css',
    javascript: 'app/js',
    pages: 'app/pages',
    static: 'app/static',
    views: 'app/views',
  },
  handlebars: (handlebars) => {
    handlebars.registerHelper({
      capitalize: val => val.toUpperCase(),

      // We need a Handlebars helper to retrieve the data from metalsmith.
      pageSpecificMessage: options =>
        new handlebars.SafeString(options.data.root.pageSpecificMessage),
    });
  },
  output: 'dist',
};
