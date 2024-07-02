var baseConfig = require('./karma.conf.js');

module.exports = function (config) {
  baseConfig(config);

  config.set({
    reporters: ['teamcity'],
    browsers: ['ChromeHeadless'],
    colors: false,
    singleRun: true
  });
};
