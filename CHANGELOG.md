# Changelog

### latest

- nothing so far


### 0.3.1 (August 24, 2016)

- update template to include scss file in layouts
- get sourcemaps working for scss files
- allow environment variable `TEST_TIMEOUT` to allow tests to run longer


### 0.3.0 (August 24, 2016)

- changed main script to the same name as the project
- moved location of scripts from `bin` to `scripts` folder
- created `slipcast-cli` npm package as a lightweight project bootstrapper; separate script responsibilities
    - `slipcast-cli` will create new projects while `slipcast` will run `build` and `watch` in user's projects
- moved `Procfile` to a temp directory that is cleaned up automatically when the process ends
- refactored scripts and configs to make future `eject` command easier to use
- removed `cross-spawn` dependency that was not being used
- require a `slipcast.js` config file
- allow passing cached `node_modules` folder for faster test runs
- disable `autoprefixer` in `cssnano` since `cssnext` already includes it
- replace `mkdirp` and `rimraf` dependencies with `fs-extra`
- add `'use strict;'` to all js files


### 0.2.0 (July 20, 2016)

- small modifications to metalsmith plugin configs to not rename until layouts plugin and filter initial files by `.hbs` extension
- add test to confirm multiple layouts can be utilized
- add file path info to metalsmith metadata for each page
- allow project specific Metalsmith plugins to be passed to build process before and after Slipcast plugins run
- add some default settings to the slipcast config that can be overridden


### 0.1.0 (July 19, 2016)

- initial release
