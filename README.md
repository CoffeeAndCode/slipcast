# Static: A static website generator

This project simplifies the creation of static websites by using convention
over configuration. It relies on [Metalsmith](http://www.metalsmith.io/),
[RollupJS](http://rollupjs.org/), [PostCSS](http://postcss.org/), and
[Handlebars](http://handlebarsjs.com/) to build a directory of static css, html,
and javascript files.


## Usage

Add this to your project with `npm install coffeeandcode-static --save`. Then
you can add the following to your `package.json` file to build, compress, or
run a webserver that watches for changes.

```json
...
    "scripts": {
        "build": "coffeeandcode-static",
        "compress": "coffeeandcode-static --compress",
        "start": "coffeeandcode-static --watch"
    }
...
```


## Config File

The application looks for a file called `static.json` in the root of the
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
    "views": "app/views"
  },
  "output": "dist"
}
```


## Procfile

This project will output a `Procfile` in the calling project's directory and
will be overwritten each time `coffeeandcode-static` is called. You can either
add it to your project's `.gitignore` file or to the project itself. The contents
will not change unless your `static.json` configuration changes.
