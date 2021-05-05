import { RequestHandler, Request, Response } from 'express';
import { AuthenticationService, Errors, Method, Status } from '../../../../../core';
import { Container, Injectable } from '../../../../../helpers';
import { BaseHandler, MongoUserModel, UserModel } from '../../../../../models';

@Injectable()
export class VerifyAuthenticationCodeHandler implements BaseHandler {
  public readonly path: string;
  public readonly method: Method;

  constructor(private authenticationService: AuthenticationService) {
    this.path = '/verify-authentication-code';
    this.method = Method.Get;
  }

  public handle(): RequestHandler {
    return async (req: Request, res: Response): Promise<Response> => {
      const { email, authenticationCode } = req.body;

      const user: UserModel = await MongoUserModel.findOne({ email });

      if (user && this.authenticationService.authenticationCodeValid(email, authenticationCode)) {
        const tokens = this.authenticationService.generateTokens();

        this.authenticationService.addTokensPair(tokens);

        return res.status(Status.Success).json({ ...tokens });
      } else {
        return res.status(Status.Error).json({ message: Errors.Error });
      }
    };
  }
}

export const verifyAuthenticationCodeHandler = Container.injectSingleton(
  VerifyAuthenticationCodeHandler
);
