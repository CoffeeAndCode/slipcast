# Static: A static website generator

This project setup will compile your css, html, and javascript to the `dist/`
folder. It uses [Metalsmith](http://www.metalsmith.io/), [RollupJS](http://rollupjs.org/),
[PostCSS](http://postcss.org/), and [Handlebars](http://handlebarsjs.com/).


## Folder Structure

```
app/css/            # CSS files for the application with `application.css` as the entry point.
app/js/             # JS files for the application with `application.js` as the entry point.
app/pages/          # Markdown files that refer to individual pages in the application.
app/pages/views/    # Handlebars partials that can be used by different pages.
app/pages/layouts/  # Handlebars files that define the top-level layout of pages.
bin/                # Node scripts to handle source compilation
config/             # Config files for the different libraries
dist/               # Folder static files are written to
```


## Development

Once the dependencies are installed with `npm install`, you can run the application
with `npm start`. It will automatically watch your source files to changes to
html, css, and javascript files.
