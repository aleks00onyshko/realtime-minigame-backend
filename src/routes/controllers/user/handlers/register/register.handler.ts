import { RequestHandler, Request, Response } from 'express';

import { BaseHandler, MongoUserModel, UserModel } from 'models';
import { Method, Status, Errors } from 'core/enums';
import { AuthenticationService } from 'core';
import { Injectable, Container } from 'DI';

@Injectable()
export class RegisterHandler implements BaseHandler {
  public readonly path: string;
  public readonly method: Method;

  constructor(private authService: AuthenticationService) {
    this.path = '/register';
    this.method = Method.Post;
  }

  public handle(): RequestHandler {
    return async (req: Request, res: Response): Promise<Response> => {
      const { email, password, username } = req.body;

      const user: UserModel = await MongoUserModel.findOne({ email });

      if (!user) {
        const newUser: UserModel = new MongoUserModel({ email, password, username });

        newUser.password = await this.authService.encryptPassword(password);

        const user: UserModel = await newUser.save();

        if (user) {
          const { accessToken, refreshToken } = this.authService.generateTokens(email, user.username);

          this.authService.addTokensPair(refreshToken, accessToken);

          return res.status(Status.Success).json({ accessToken, refreshToken });
        } else {
          return res.status(Status.Error).json({ message: Errors.Error });
        }
      } else {
        return res.status(Status.Unauthorized).json({ message: Errors.UserDoesNotExist });
      }
    };
  }
}

export const registerHandler = Container.injectSingleton(RegisterHandler);
