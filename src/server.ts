import express from 'express';
import App from './app';
import HomeController from './controllers/home.controller';
import AuthController from './controllers/auth.controller';
// import ProtectedController from './controllers/protected-aws.controller';

import dotenv from "dotenv";

dotenv.config();

const app = new App({
  port: Number(process.env.PORT),
  controllers: [
    new HomeController(),
    new AuthController(),
    // new ProtectedController(),
  ],
  middlewares: [express.json()],
});

app.listen();
