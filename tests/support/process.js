module.exports.runFromDirectory = function runFromDirectory(directory, done, method) {
  const originalWorkingDirectory = process.cwd();
  process.chdir(directory);

  method.call(null, (...args) => {
    process.chdir(originalWorkingDirectory);
    done(...args);
  });
};
