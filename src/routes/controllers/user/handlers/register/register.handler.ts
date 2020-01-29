import { RequestHandler, Request, Response } from 'express';

import { BaseHandler, MongoUserModel, UserModel } from 'models';
import { Method } from 'core';

export class RegisterHandler implements BaseHandler {
  public readonly path: string;
  public readonly method: Method;

  constructor() {
    this.path = '/register';
    this.method = Method.Post;
  }

  public handle(): RequestHandler {
    return async (req: Request, res: Response): Promise<Response> => {
      const { email, password, username } = req.body;

      const doesUserExist: UserModel = await MongoUserModel.findOne({ email });

      if (!doesUserExist) {
        const newUser: UserModel = new MongoUserModel({ email, password, username });

        await newUser.encryptPassword(password);

        const user: UserModel = await newUser.save();

        if (user) {
          const token: string = await user.generateAccessToken();

          return res.status(200).json({ token });
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
