import { RequestHandler, Request, Response } from 'express';

import { BaseHandler, MongoUserModel, UserModel } from 'models';
import { Method, Status, AuthenticationService, Errors } from 'core';
import { Injectable, Container } from 'DI';

@Injectable()
export class LoginHandler implements BaseHandler {
  public readonly path: string;
  public readonly method: Method;

  constructor(private authService: AuthenticationService) {
    this.path = '/login';
    this.method = Method.Post;
  }

  public handle(): RequestHandler {
    return async (req: Request, res: Response): Promise<Response> => {
      const { email, password } = req.body;
      const user: UserModel = await MongoUserModel.findOne({ email });

      if (user) {
        if (await this.authService.passwordValid(password, user.password)) {
          const { accessToken, refreshToken } = this.authService.generateTokens(email, user.username);

          this.authService.addTokensPair(refreshToken, accessToken);

          return res.status(Status.Success).json({ accessToken, refreshToken });
        } else {
          return res.status(Status.Error).json({ message: Errors.InvalidPassword });
        }
      } else {
        return res.status(Status.NotFound).json({ message: Errors.UserDoesNotExist });
      }
    };
  }
}

export const loginHandler = Container.injectSingleton(LoginHandler);
