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
    }
  },
  clientOptions: {
    environmentScripts: [
      'sinon/pkg/sinon.js'
    ]
  }
};
