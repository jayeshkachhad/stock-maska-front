module.exports = {
  apps: [
    {
      name: "shopify-app-front",
      script: "react-router-serve",
      args: "./build/server/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 1465
      }
    }
  ]
};