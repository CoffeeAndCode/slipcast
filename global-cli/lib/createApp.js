'use strict';

const spawn = require('./spawn');
const { mkdirSync, statSync, writeFileSync } = require('fs');
const { basename, join, resolve } = require('path');

module.exports = (options) => {
  try {
    statSync(options.destination).isDirectory();
    options.callback(new Error(`The directory \`${options.destination}\` already exists. Aborting.`));
    return;
  } catch (exception) {
    // skip exception if folder can't be found
    if (!exception.message.includes('ENOENT: no such file or directory')) {
      throw exception;
    }
  }

  const projectDirectory = resolve(options.destination);
  const appName = basename(projectDirectory);

  options.log(`Creating a new Slipcast app in ${projectDirectory}.\n`);
  mkdirSync(projectDirectory);

  const packageJson = {
    name: appName,
    version: '0.0.1',
    private: true,
  };
  writeFileSync(join(projectDirectory, 'package.json'), JSON.stringify(packageJson, null, 2));
  process.chdir(projectDirectory);

  options.log('Installing slipcast from npm. This might take a bit.\n');

  const installCommands = {
    npm: 'npm install --save slipcast',
    yarn: 'yarn add slipcast',
  };

  spawn('type', ['yarn'], { stdio: 'ignore' })
    .on('close', (code) => {
      let installCommand = installCommands.npm;
      if (code === 0) {
        installCommand = installCommands.yarn;
      }

      const [command, ...args] = installCommand.split(' ').concat(options.verbose && '--verbose').filter(arg => arg);
      const task = spawn(command, args, { stdio: options.stdio });

      task.on('close', (installCode) => {
        if (installCode !== 0) {
          options.callback(new Error(`\`${command} ${args.join(' ')}\' failed`));
          return;
        }

        // eslint-disable-next-line global-require, import/no-dynamic-require
        const init = require(join(process.cwd(), 'node_modules/slipcast/scripts/init'));
        init(projectDirectory, appName, options.verbose).then(() => {
          options.callback();
        }).catch(options.callback);
      });

      task.on('error', (error) => {
        options.stdio[2].write(`${error.toString()}\n`);
      });
    })
    .on('error', (error) => {
      options.stdio[2].write(`${error.toString()}\n`);
    });
};
