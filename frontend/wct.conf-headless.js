module.exports = {
  verbose: true,
  sauce: false,
  suites: ['test/suites/*'],
  plugins: {
    sauce: {
      disabled: true
    },
    local: {
      remote: false,
      browsers: ['chrome'],
      browserOptions: {
        chrome: [
          "headless",
          "disable-gpu",
          "no-sandbox"
        ]
      }
    },
    'mocha-teamcity-reporter': true
  },
  clientOptions: {
    environmentScripts: [
      'sinon/pkg/sinon.js'
    ]
  }
};
