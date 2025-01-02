import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import CognitoService from '../services/cognito.service';

export default class AuthController {
  public path = '/auth';

  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post('/signup', this.validateBody('signUp'), this.signUp);
    this.router.post('/signin', this.validateBody('signIn'), this.signIn);
    this.router.post('/verify', this.validateBody('verify'), this.verify);
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  signUp(req: Request, res: Response) {
    const result = validationResult(req);
    console.log({ result });
    if (!result.isEmpty()) {
      return res.status(422).json({
        errors: result.array(),
      });
    }

    const {
      // eslint-disable-next-line camelcase
      username, password, email, name, family_name, birthdate,
    } = req.body;
    const userAttr = [];
    userAttr.push({
      Name: 'email', Value: email,
    });
    userAttr.push({
      Name: 'name', Value: name,
    });
    userAttr.push({
      // eslint-disable-next-line camelcase
      Name: 'family_name', Value: family_name,
    });
    userAttr.push({
      Name: 'birthdate', Value: birthdate,
    });

    const cognito = new CognitoService();
    cognito.signUpUser(username, password, userAttr).then((success) => {
      if (success) {
        res.status(200).end();
      } else {
        res.status(500).end();
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this, consistent-return
  signIn(req: Request, res: Response) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({
        errors: result.array(),
      });
    }
    const { username, password } = req.body;
    const cognito = new CognitoService();
    cognito.signInUser(username, password).then((success) => {
      if (success) {
        res.status(200).end();
      } else {
        res.status(500).end();
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this, consistent-return
  verify(req: Request, res: Response) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({
        errors: result.array(),
      });
    }
    const {
      username, code,
    } = req.body;

    const cognito = new CognitoService();
    cognito.verifyAccount(username, code).then((success) => {
      if (success) {
        res.status(200).end();
      } else {
        res.status(500).end();
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private validateBody(type: string) {
    switch (type) {
      case 'signUp': {
        return [
          body('username').notEmpty().isLength({ min: 6 }),
          body('email').notEmpty().normalizeEmail().isEmail(),
          body('password').isString().isLength({ min: 8 }),
          body('birthdate').exists().isISO8601(),
          body('name').notEmpty().isString(),
          body('family_name').notEmpty().isString(),
        ];
      }
      case 'signIn': {
        return [
          body('username').notEmpty().isLength({ min: 6 }),
          body('password').isString().isLength({ min: 8 }),
        ];
      }
      case 'verify':
      default: {
        return [
          body('username').notEmpty().isLength({ min: 6 }),
          body('code').isString().isLength({ min: 6, max: 6 }),
        ];
      }
    }
  }
}
