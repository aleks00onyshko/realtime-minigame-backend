import { RequestHandler, Request, Response } from 'express';
import { AuthenticationService, Errors, Method, Status } from '../../../../../core';
import { Container, Injectable } from '../../../../../helpers';
import { BaseHandler, MongoUserModel, UserModel } from '../../../../../models';

@Injectable()
export class VerifyEmailHandler implements BaseHandler {
  public readonly path: string;
  public readonly method: Method;

  constructor(private authenticationService: AuthenticationService) {
    this.path = '/verify-email';
    this.method = Method.Get;
  }

  public handle(): RequestHandler {
    return async (req: Request, res: Response): Promise<Response> => {
      const { email } = req.body;

      const user: UserModel = await MongoUserModel.findOne({ email });

      if (user) {
        const authenticationCode = this.authenticationService.generateAuthenticationCode();

        this.authenticationService.addAuthenticationCode(email, authenticationCode);

        await this.authenticationService.sendAuthenticationCodeViaEmail(email, authenticationCode);

        return res.status(Status.Success).json({ message: 'Email is verified' });
      } else {
        return res.status(Status.Error).json({ message: Errors.Error });
      }
    };
  }
}

export const verifyEmailHandler = Container.injectSingleton(VerifyEmailHandler);
