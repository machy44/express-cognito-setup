import express, { Request, Response } from 'express';
import AwsAuthMiddleware from '../middlewares/auth';

export default class ProtectedController {
  public path = '/protected';

  public router = express.Router();

  private authMiddleware;

  constructor() {
    this.authMiddleware = new AwsAuthMiddleware();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.use(this.authMiddleware.verifyToken);
    this.router.get('/secret', this.home);
  }

  // eslint-disable-next-line class-methods-use-this
  home(req: Request, res: Response) {
    res.send('the secret is cupcakes');
  }
}
