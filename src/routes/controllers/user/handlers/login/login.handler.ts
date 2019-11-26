import { RequestHandler, Request, Response } from 'express';

import { BaseHandler, User, IUserModel } from 'models';
import { Method } from 'core';

export class LoginHandler implements BaseHandler {
  public readonly path: string;
  public readonly method: Method;

  constructor() {
    this.path = '/login';
    this.method = Method.Post;
  }

  public handle(): RequestHandler {
    return async function login(req: Request, res: Response): Promise<Response> {
      const { email, password } = req.body;
      const user: IUserModel = await User.findOne({ email });

      if (user) {
        if (await user.isPasswordValid(password)) {
          const accessToken: string = user.generateAccessToken();

          return res.status(200).json({ accessToken });
        } else {
          return res.status(500).json({ message: 'Wrong password!' });
        }
      } else {
        return res.status(404).json({ message: 'User with such email does not exist!' });
      }
    };
  }
}

export const loginHandler = new LoginHandler();
