import { RequestHandler, Request, Response } from 'express';

import { BaseHandler, MongoUserModel, UserModel } from 'models';
import { Method, Status } from 'core/enums';

export class LoginHandler implements BaseHandler {
  public readonly path: string;
  public readonly method: Method;

  constructor() {
    this.path = '/login';
    this.method = Method.Post;
  }

  public handle(): RequestHandler {
    return async (req: Request, res: Response): Promise<Response> => {
      const { email, password } = req.body;
      const user: UserModel = await MongoUserModel.findOne({ email });

      if (user) {
        if (await user.isPasswordValid(password)) {
          const accesstToken: string = await user.generateAccessToken();
          const refreshToken: string = await user.generateRefreshToken();

          return res.status(Status.Success).json({ accesstToken, refreshToken });
        } else {
          return res.status(Status.Error).json({ message: 'Wrong password!' });
        }
      } else {
        return res.status(Status.NotFound).json({ message: 'User with such email does not exist!' });
      }
    };
  }
}

export const loginHandler = new LoginHandler();
