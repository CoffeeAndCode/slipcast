'use strict';

const config = require('../../config/slipcast');
const handlebars = require('handlebars');
const Metalsmith = require('metalsmith');
const { join, parse } = require('path');

if (config.handlebars) {
  config.handlebars(handlebars);
}

Metalsmith.prototype.uses = function uses(plugins) {
  this.plugins.push.apply(this.plugins, plugins); // eslint-disable-line prefer-spread
  return this;
};

Metalsmith('.') // eslint-disable-line new-cap
  .clean(false)
  .destination(config.output)
  .source(config.folders.pages)
  .uses(config.build.html.beforePlugins)
  .use((files, metalsmith, done) => {
    Object.keys(files).forEach((file) => {
      files[file].path = parse(file); // eslint-disable-line no-param-reassign
    });
    done();
  })
  .use(require('metalsmith-in-place')({
    engine: 'handlebars',
    partials: config.folders.views,
    pattern: '**/*.hbs',
  }))
  .use(require('metalsmith-layouts')({
    default: 'application.hbs',
    directory: join(config.folders.views, 'layouts'),
    engine: 'handlebars',
    pattern: '**/*.hbs',
    partials: config.folders.views,
    rename: true,
  }))
  .uses(config.build.html.afterPlugins)
  .build((error) => {
    if (error) { throw error; }
  });
