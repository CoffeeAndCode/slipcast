const { spawn, spawnSync } = require('child_process');
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

  // hack to make tests run faster since the npm install takes so long
  if (options.nodeModules) {
    spawnSync('cp', [
      '-R',
      options.nodeModules,
      join(projectDirectory, 'node_modules'),
    ], { stdio: options.stdio });
  }

  const packageJson = {
    name: appName,
    version: '0.0.1',
    private: true,
  };
  writeFileSync(join(projectDirectory, 'package.json'), JSON.stringify(packageJson, null, 2));
  process.chdir(projectDirectory);

  options.log('Installing slipcast from npm. This might take a bit.\n');

  const args = [
    'install',
    options.verbose && '--verbose',
    '--save',
    'slipcast',
  ].filter(arg => arg);
  const task = spawn('npm', args, { stdio: options.stdio });

  task.on('close', (code) => {
    if (code !== 0) {
      options.callback(new Error(`\`npm ${args.join(' ')}\' failed`));
      return;
    }

    const init = require(join(process.cwd(), 'node_modules/slipcast/scripts/init'));
    init(projectDirectory, appName, options.verbose).then(() => {
      options.callback();
    }).catch(options.callback);
  });
};
