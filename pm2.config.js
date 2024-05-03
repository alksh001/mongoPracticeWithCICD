module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'npm',
      args: 'run start:backend',
      cwd: './backend',
      watch: true,
    },
  ],
};