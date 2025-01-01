import express from 'express';
import App from './app';
// import HomeController from './controllers/home-aws.controller';
// import AuthController from './controllers/auth-aws.controller';
// import ProtectedController from './controllers/protected-aws.controller';

const app = new App({
  port: 3000,
  controllers: [
    // new HomeController(),
    // new AuthController(),
    // new ProtectedController(),
  ],
  middlewares: [express.json()],
});

app.listen();
