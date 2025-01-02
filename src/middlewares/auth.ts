/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import jwkToPem from 'jwk-to-pem';
import fetch from 'node-fetch';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const pems = {};

export default class AuthMiddleware {
  private poolRegion: string = process.env.COGNITO_REGION as string;

  private userPoolId = process.env.COGNITO_POOL_ID as string;

  constructor() {
    this.setUp();
  }

  // eslint-disable-next-line consistent-return, class-methods-use-this
  verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Auth');
    console.log('🚀 ~ AuthMiddleware ~ verifyToken ~ token:', token);
    if (!token) {
      return res.status(401).send('Token is required');
    }

    const decodeJwt = jwt.decode(token, {
      complete: true,
    });

    if (!decodeJwt) {
      res.status(401).end();
      // eslint-disable-next-line consistent-return
      return;
    }

    const { kid } = decodeJwt.header;
    // @ts-ignore
    const pem = pems[kid];

    if (!pem) {
      res.status(401).end();
      return;
    }

    // @ts-ignore
    jwt.verify(token, pem, (err, payload) => {
      if (err) {
        res.status(401).end();
        return;
      }
      next();
    });
  }

  private async setUp() {
    const URL = `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`;

    try {
      const response = await fetch(URL);
      if (response.status !== 200) {
        // eslint-disable-next-line no-throw-literal
        throw 'request not successful';
      }
      const data = await response.json();
      // @ts-ignore
      const { keys } = data;

      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        const key_id = key.kid;
        const modulus = key.n;
        const exponent = key.e;
        const key_type = key.kty;
        const jwk = { kty: key_type, n: modulus, e: exponent };
        const pem = jwkToPem(jwk);
        // @ts-ignore
        pems[key_id] = pem;
      }

      console.log('got all pems');
    } catch (error) {
      console.log('sorry could not fetch jwks');
    }
  }
}
