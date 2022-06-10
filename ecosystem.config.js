module.exports = {
  apps: [
    {
      name: 'discord-telegram-bridge',
      script: 'dist/app.js',
      autorestart: true,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
