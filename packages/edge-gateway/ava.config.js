export default {
  files: ['test/*.spec.js'],
  timeout: '5m',
  concurrency: 1,
  nodeArguments: ['--experimental-vm-modules'],
}
