module.exports.runFromDirectory = function(directory, done, method) {
  const originalWorkingDirectory = process.cwd();
  process.chdir(directory);

  method.call(null, function() {
    process.chdir(originalWorkingDirectory);
    done.apply(null, arguments);
  });
}
