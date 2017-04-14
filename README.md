# Slipcast: A static website generator

This project simplifies the creation of static websites by using convention
over configuration to create an enjoyable front-end development experience.

Behind the scenes, it relies on [Metalsmith](http://www.metalsmith.io/),
[RollupJS](http://rollupjs.org/), [PostCSS](http://postcss.org/),
[Handlebars](http://handlebarsjs.com/), and [Browsersync](https://www.browsersync.io/)
to build a directory of static css, html, and javascript files as well as a
development mode that reloads your changes as files are saved. However, you
don't have to worry about the details.

We've also made it easy for you to move on from `slipcast` if your complex
application needs can no longer be handled by us. We've included an `eject`
command that will remove `slipcast` and setup your project to run on the same
scripts and configurations we've hidden behind the curtain for you to further
customize or replace entirely.


## Usage

The easiest way to get started is to install the Slipcast project cli
to generate new Slipcast projects: `npm install -g slipcast-cli`

You can then run `slipcast-cli folder_name` to create a new project inside
`folder_name`. It takes a bit to install the dependencies, but afterwards
your project will run the default template included with Slipcast.

### Without Slipcast-CLI

You can also install slipcast yourself by adding it to your project
manually with `npm install slipcast --save` and editing your `package.json`
file with scripts to build the project, compress built assets, or run
a webserver that watches files for changes.

```json
...
    "scripts": {
        "build": "node node_modules/slipcast/bin/slipcast --build",
        "compress": "node node_modules/slipcast/bin/slipcast --compress",
        "eject": "node node_modules/slipcast/bin/slipcast --eject",
        "start": "node node_modules/slipcast/bin/slipcast --watch"
    }
...
```

You can view an example application structure by looking in the `template` folder.
It's the same project that will be installed if you use `slipcast-cli` to
create your initial project.


## Config File

The application looks for a file called `slipcast.js` in the root of the
application folder for the configuration.

The minimal configuration file looks like:

```js
module.exports = {
  files: ['app.css', 'app.js']
};
```

You can override more of the default options with a configuration file
like the following:

```js
module.exports = {
  // Top-level css and js files to generate.
  files: [
    'application.css',
    'application.js'
  ],

  // The folders to look at for files that generate the project css, js, and html.
  folders: {
    css: 'app/css',
    javascript: 'app/js',
    pages: 'app/pages',
    static: 'app/static',
    views: 'app/views'
  },

  output: 'dist' // Where to store the output files.
};
```

## Ejecting

Once you've outgrown Slipcast, you can migrate all of the dependencies,
scripts, and configuration to your main project by running
`npm run eject`.

*Warning:* This is a one-way operation and once you eject you will not
be able to use slipcast again. You will be able to continue to use the
same commands like `npm start` and `npm run build` though.
