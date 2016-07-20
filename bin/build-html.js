#!/usr/bin/env node

const config = require('../lib/config');
const Metalsmith = require('metalsmith');
const { join } = require('path');

Metalsmith('.')
  .clean(false)
  .destination(config.output)
  .source(config.folders.pages)
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
  .build(function(error) {
    if (error) { throw error; }
  });
