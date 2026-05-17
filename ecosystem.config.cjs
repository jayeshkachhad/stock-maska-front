module.exports = {
  apps: [
    {
      name: "shopify-app",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 1465
      }
    }
  ]
};