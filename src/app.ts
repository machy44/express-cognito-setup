import express, { Application, Router } from 'express';

type Controller = {
  path: string, router: Router
}

class App {
  public app: Application;

  private port: number;

  constructor(appInit: {
    port: number,
    middlewares: any,
    controllers: Controller[];
  }) {
    this.app = express();
    this.port = appInit.port;
    this.middlewares(appInit.middlewares);
    this.routes(appInit.controllers);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App has started on ${this.port}`);
    });
  }

  private middlewares(middlewares: any[]) {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  private routes(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });
  }
}

export default App;
