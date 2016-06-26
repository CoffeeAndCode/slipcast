const Metalsmith = require('metalsmith');

const [ , , destinationFolder] = process.argv;

Metalsmith('app')
  .clean(false)
  .destination(`../${destinationFolder}`)
  .source('./pages')
  .use(require('metalsmith-in-place')({
    engine: 'handlebars',
    partials: 'views',
    pattern: '**/*.hbs',
    rename: true
  }))
  .use(require('metalsmith-layouts')({
    default: 'application.hbs',
    directory: 'views/layouts',
    engine: 'handlebars',
    partials: 'views',
    rename: true
  }))
  .build(function(error) {
    if (error) { throw error; }
  });
