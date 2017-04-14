# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).


## [Unreleased] - Unreleased
- nothing yet


## [0.1.6] - 2017-04-14
### Changed
- change package bin definition to be explicit
- remove slash from "files" folder listing in package.json


## [0.1.5] - 2017-04-13
### Fixed
- added index.js back to files list; apparently it doesn't add the bin file


## [0.1.4] - 2017-04-13
### Added
- added LICENSE file to project

### Fixed
- fixed package.json which was not including all lib/ files


## [0.1.3] - 2017-01-31
### Changed
- move project files under "packages" folder
- update js syntax to align with new linting rules


## [0.1.2] - 2016-09-19
### Added
- rethrow exceptions not related to install directory check


## 0.1.1 - 2016-08-24
### Added
- created `slipcast-cli` npm package as a lightweight project bootstrapper; separate script responsibilities
    - `slipcast-cli` will create new projects while `slipcast` will run `build` and `watch` in user's projects
- initial release


[Unreleased]: https://github.com/CoffeeAndCode/slipcast/compare/slipcast-cli@0.1.6...HEAD
[0.1.6]: https://github.com/CoffeeAndCode/slipcast/compare/slipcast-cli@0.1.5...slipcast-cli@0.1.6
[0.1.5]: https://github.com/CoffeeAndCode/slipcast/compare/slipcast-cli@0.1.4...slipcast-cli@0.1.5
[0.1.4]: https://github.com/CoffeeAndCode/slipcast/compare/slipcast-cli@0.1.3...slipcast-cli@0.1.4
[0.1.3]: https://github.com/CoffeeAndCode/slipcast/compare/slipcast-cli@0.1.2...slipcast-cli@0.1.3
[0.1.2]: https://github.com/CoffeeAndCode/slipcast/compare/slipcast-cli@0.1.1...slipcast-cli@0.1.2
