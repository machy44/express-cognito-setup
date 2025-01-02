// business logic layer
import AWS from 'aws-sdk';
import crypto from 'crypto';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export default class CognitoService {
  private config = {
    region: process.env.COGNITO_REGION,
  };

  private secretHash = process.env.COGNITO_SECRET_HASH as string;

  private clientId = process.env.COGNITO_CLIENT_ID as string;

  private cognitoIdentity;

  constructor() {
    this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config);
  }

  public async signUpUser(
    username: string,
    password: string,
    userAttr: { Name: string, Value: string; }[],
  ): Promise<boolean> {
    const params = {
      ClientId: this.clientId,
      Password: password,
      Username: username,
      SecretHash: this.generateHash(username),
      UserAttributes: userAttr,
    };

    try {
      const data = await this.cognitoIdentity.signUp(params).promise();
      console.log(data);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async verifyAccount(username: string, code: string): Promise<boolean> {
    const params = {
      ClientId: this.clientId,
      Username: username,
      SecretHash: this.generateHash(username),
      ConfirmationCode: code,
    };

    try {
      const data = await this.cognitoIdentity.confirmSignUp(params).promise();
      console.log(data);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async signInUser(username: string, password: string): Promise<boolean> {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: this.generateHash(username),
      },
    };

    try {
      const data = await this.cognitoIdentity.initiateAuth(params).promise();
      console.log(data);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  private generateHash(username: string): string {
    return crypto.createHmac('SHA256', this.secretHash)
      .update(username + this.clientId)
      .digest('base64');
  }
}
