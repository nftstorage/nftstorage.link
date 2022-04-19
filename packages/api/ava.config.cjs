const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

const envPath = path.join(__dirname, '../../.env')
if (fs.statSync(envPath, { throwIfNoEntry: false })) {
  dotenv.config({
    path: envPath,
  })
}

module.exports = {
  nonSemVerExperiments: {
    configurableModuleFormat: true,
  },
  files: ['test/*.spec.js'],
  timeout: '5m',
  concurrency: 1,
  nodeArguments: ['--experimental-vm-modules'],
  require: ['dotenv/config', './test/_setup-browser-env.js'],
}
