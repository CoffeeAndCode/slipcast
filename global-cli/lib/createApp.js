const { spawn, spawnSync } = require('child_process');
const { mkdirSync, statSync, writeFileSync } = require('fs');
const { basename, join, resolve } = require('path');

module.exports = function(name, verbose, node_modules=null) {
  try {
    statSync(name).isDirectory();
    console.error(`The directory \`${name}\` already exists. Aborting.`);
    process.exit(1);
  } catch (exception) {
    // skip exception if folder can't be found
  }

  const projectDirectory = resolve(name);
  const appName = basename(projectDirectory);

  console.log(`Creating a new Slipcast app in ${projectDirectory}.\n`);
  mkdirSync(projectDirectory);

  // hack to make tests run faster since the npm install takes so long
  if (node_modules) {
    spawnSync('cp', [
      '-R',
      node_modules,
      join(projectDirectory, 'node_modules')
    ], { stdio: 'inherit' });
  }

  const packageJson = {
    name: appName,
    version: '0.0.1',
    private: true
  };
  writeFileSync(join(projectDirectory, 'package.json'), JSON.stringify(packageJson, null, 2));
  process.chdir(projectDirectory);

  console.log("Installing slipcast from npm. This might take a bit.\n");

  run(projectDirectory, appName, verbose);
}

function run(projectDirectory, appName, verbose) {
  const args = [
    'install',
    verbose && '--verbose',
    '--save',
    'slipcast'
  ].filter(function(arg) { return arg; });
  const task = spawn('npm', args, { stdio: 'inherit' });

  task.on('close', function (code) {
    if (code !== 0) {
      console.error(`\`npm ${args.join(' ')}\' failed`);
      process.exit(1);
    }

    const init = require(join(process.cwd(), 'node_modules/slipcast/scripts/init'));
    init(projectDirectory, appName, verbose);
  });
}
