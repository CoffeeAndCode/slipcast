'use strict';

const { writeFileSync } = require('fs');
const { copySync, removeSync } = require('fs-extra');
const { join } = require('path');
const prompt = require('../lib/prompt');

module.exports = () => {
  console.log('You are about to eject from slipcast. This action is irreversible.');

  prompt('Would you like to continue?').then((proceed) => {
    if (!proceed) {
      console.log('Eject aborted.');
      process.exit(1);
    }

    console.log('\nEjecting...\n');

    console.log('- copying config directory');
    copySync(join(__dirname, '..', 'config'), join(process.cwd(), 'config'));

    console.log('- copying scripts directory');
    copySync(join(__dirname, '..', 'scripts'), join(process.cwd(), 'scripts'));

    console.log('- removing eject script');
    removeSync(join(process.cwd(), 'scripts', 'eject.js'));

    console.log('- removing init script');
    removeSync(join(process.cwd(), 'scripts', 'init.js'));

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const clientPackage = require(join(process.cwd(), 'package.json'));
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const libraryPackage = require(join(__dirname, '..', 'package.json'));

    Object.keys(clientPackage.scripts).forEach((key) => {
      clientPackage.scripts[key] = clientPackage.scripts[key].replace(/slipcast --(\w+)/g, 'node -e \'require("./scripts/$1")();\'');
    });
    delete clientPackage.scripts.eject;

    Object.assign(clientPackage.dependencies, libraryPackage.dependencies);
    delete clientPackage.dependencies.slipcast;

    console.log('- updating package.json');
    writeFileSync(join(process.cwd(), 'package.json'),
      JSON.stringify(clientPackage, null, 2)
    );

    console.log('Eject completd successfully.');
  });
};
