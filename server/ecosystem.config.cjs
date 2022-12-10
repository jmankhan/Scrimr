module.exports = {
  apps: [
      {
          name: 'token',
          script: 'bin/www.js',
          watch: true,
          watch_options: {
            usePolling: true
          },
          env: {
            PORT: 3001
          }
      }
  ]
};