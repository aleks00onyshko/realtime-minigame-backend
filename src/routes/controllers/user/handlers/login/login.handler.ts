import { RequestHandler, Request, Response } from 'express';

import { BaseHandler, MongoUserModel, UserModel } from 'models';
import { Method, Status, AuthenticationService, Errors } from 'core';
import { Injectable } from 'DI';

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

@Injectable()
export class LoginHandler implements BaseHandler {
  public readonly path: string;
  public readonly method: Method;

  constructor(private authenticationService: AuthenticationService) {
    this.path = '/login';
    this.method = Method.Post;
  }

  public handle(): RequestHandler {
    return async (req: LoginRequest, res: Response): Promise<Response> => {
      const { email, password } = req.body;
      const user: UserModel = await MongoUserModel.findOne({ email });

      if (user) {
        if (await this.authenticationService.isPasswordValid(password, user.password)) {
          const tokens = this.authenticationService.generateTokens();

          this.authenticationService.addTokensPair(tokens);

          return res.status(Status.Success).json({ ...tokens });
        } else {
          return res.status(Status.Error).json({ message: Errors.InvalidPassword });
        }
      } else {
        return res.status(Status.NotFound).json({ message: Errors.UserDoesNotExist });
      }
    };
  }
}
