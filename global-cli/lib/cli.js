const createApp = require('./createApp');
const help = require('./help');
const minimist = require('minimist');
const { version } = require('../package.json');

const minimistConfig = {
  alias: {
    h: 'help',
    v: 'version',
  },
};

class CLI {
  constructor(ui) {
    this.argv = ui.argv;
    this.stderr = ui.stderr;
    this.stdin = ui.stdin;
    this.stdout = ui.stdout;
  }

  log(message) {
    this.stdout.write(`${message}\n`);
  }

  run(callback) {
    const commands = minimist(this.argv, minimistConfig);
    const verbose = commands.verbose;

    if (commands.help || this.argv.length === 0) {
      this.log(help());
      return callback();
    } else if (!commands.version) {
      createApp({
        callback,
        destination: commands._[0],
        log: this.log.bind(this),
        nodeModules: commands.node_modules,
        stdio: [this.stdin, this.stdout, this.stderr],
        verbose,
      });
    }

    this.log(version);
    return callback();
  }
}

module.exports = CLI;
