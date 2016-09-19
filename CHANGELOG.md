# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).


## [Unreleased] - Unreleased
- nothing yet


## [0.4.0] - 2016-09-19
### Added
- allow consuming apps to access handlbars
- allow user config override of commonjs plugin config
- add eject command
- slipcast-cli: rethrow exceptions not related to install directory check

### Changed
- update dependencies
- better error output for css / js build scripts
- output error if slipcast config encounters an issue
- updated changelog format and added semver notice
- rethrow non-config file missing exceptions


## [0.3.1] - 2016-08-24
### Added
- update template to include scss file in layouts
- get initial sourcemaps working for scss files
- allow environment variable `TEST_TIMEOUT` to allow tests to run longer


## [0.3.0] - 2016-08-24
### Added
- created `slipcast-cli` npm package as a lightweight project bootstrapper; separate script responsibilities
    - `slipcast-cli` will create new projects while `slipcast` will run `build` and `watch` in user's projects
- allow passing cached `node_modules` folder for faster test runs

### Changed
- changed main script to the same name as the project
- moved location of scripts from `bin` to `scripts` folder
- moved `Procfile` to a temp directory that is cleaned up automatically when the process ends
- refactored scripts and configs to make future `eject` command easier to use
- removed `cross-spawn` dependency that was not being used
- require a `slipcast.js` config file
- disable `autoprefixer` in `cssnano` since `cssnext` already includes it
- replace `mkdirp` and `rimraf` dependencies with `fs-extra`
- add `'use strict;'` to all js files


## [0.2.0] - 2016-07-20
### Added
- add test to confirm multiple layouts can be utilized
- add file path info to metalsmith metadata for each page

### Changed
- small modifications to metalsmith plugin configs to not rename until layouts plugin and filter initial files by `.hbs` extension
- allow project specific Metalsmith plugins to be passed to build process before and after Slipcast plugins run
- add some default settings to the slipcast config that can be overridden


## 0.1.0 - 2016-07-19
### Added
- initial release


[Unreleased]: https://github.com/CoffeeAndCode/slipcast/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/CoffeeAndCode/slipcast/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/CoffeeAndCode/slipcast/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/CoffeeAndCode/slipcast/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/CoffeeAndCode/slipcast/compare/v0.1.0...v0.2.0
