import { RequestHandler, Request, Response } from 'express';

import { BaseHandler, User, IUserModel } from 'models';
import { Method } from 'core';

export class RegisterHandler implements BaseHandler {
  public readonly path: string;
  public readonly method: Method;

  constructor() {
    this.path = '/register';
    this.method = Method.Post;
  }

  public handle(): RequestHandler {
    return async function register(req: Request, res: Response): Promise<Response> {
      const { email, password, username } = req.body;

      const doesUserExist: IUserModel = await User.findOne({ email });

      if (!doesUserExist) {
        const newUser: IUserModel = new User({ email, password, username });

        await newUser.encryptPassword(password);

        const user: IUserModel = await newUser.save();

        if (user) {
          const accessToken: string = user.generateAccessToken();

          return res.status(200).json({ accessToken });
        } else {
          return res.status(500).json({ message: 'Error was occured!' });
        }
      } else {
        return res.status(401).json({ message: 'User with such email is already exist!' });
      }
    };
  }
}

export const registerHandler = new RegisterHandler();
