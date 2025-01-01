import express, { Request, Response } from 'express';

export default class HomeController {
  public path = '/';

  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/', this.home);
  }

  // eslint-disable-next-line class-methods-use-this
  home(req: Request, res: Response) {
    res.send('success');
  }
}
