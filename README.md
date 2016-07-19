# Slipcast: A static website generator

This project simplifies the creation of static websites by using convention
over configuration. It relies on [Metalsmith](http://www.metalsmith.io/),
[RollupJS](http://rollupjs.org/), [PostCSS](http://postcss.org/), and
[Handlebars](http://handlebarsjs.com/) to build a directory of static css, html,
and javascript files.


## Usage

Add this to your project with `npm install slipcast --save`. Then
you can add the following to your `package.json` file to build, compress, or
run a webserver that watches for changes.

```json
...
    "scripts": {
        "build": "slipcast",
        "compress": "slipcast --compress",
        "start": "slipcast --watch"
    }
...
```


## Config File

The application looks for a file called `slipcast.json` in the root of the
application folder for the configuration.

The configuration file looks like:

```json
{
  "files": [
    "application.css",
    "application.js"
  ],
  "folders": {
    "css": "app/css",
    "javascript": "app/js",
    "pages": "app/pages",
    "static": "app/static",
    "views": "app/views"
  },
  "output": "dist"
}
```


## Procfile

This project will output a `Procfile` in the calling project's directory and
will be overwritten each time `slipcast` is called. You can either
add it to your project's `.gitignore` file or to the project itself. The contents
will not change unless your `slipcast.json` configuration changes.
