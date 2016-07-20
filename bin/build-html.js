#!/usr/bin/env node

const config = require('../lib/config');
const Metalsmith = require('metalsmith');
const { join, parse } = require('path');

Metalsmith.prototype.uses = function(plugins) {
  this.plugins.push.apply(this.plugins, plugins);
  return this;
}

Metalsmith('.')
  .clean(false)
  .destination(config.output)
  .source(config.folders.pages)
  .use(function(files, metalsmith, done) {
    Object.keys(files).forEach(file => {
      files[file].path = parse(file);
    });
    done();
  })
  .use(require('metalsmith-in-place')({
    engine: 'handlebars',
    partials: config.folders.views,
    pattern: '**/*.hbs'
  }))
  .use(require('metalsmith-layouts')({
    default: 'application.hbs',
    directory: join(config.folders.views, 'layouts'),
    engine: 'handlebars',
    pattern: '**/*.hbs',
    partials: config.folders.views,
    rename: true
  }))
  .uses(config.build.plugins)
  .build(function(error) {
    if (error) { throw error; }
  });
