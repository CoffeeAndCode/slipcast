const readline = require('readline');

module.exports = function(message) {
  return new Promise(resolve => {
    const prompt = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    prompt.question(`${message} [y/N]: `, (response) => {
      prompt.close();
      resolve(Boolean(response.match(/^(yes|y)$/i)));
    });
  });
}
