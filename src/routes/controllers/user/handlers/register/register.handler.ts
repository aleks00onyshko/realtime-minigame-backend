import { RequestHandler, Request, Response } from 'express';

import { BaseHandler, MongoUserModel, UserModel } from 'models';
import { Method, Status } from 'core/enums';

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
          const accesstToken: string = await user.generateAccessToken();
          const refreshToken: string = await user.generateRefreshToken();

          return res.status(Status.Success).json({ accesstToken, refreshToken });
        } else {
          return res.status(Status.Error).json({ message: 'Error was occured!' });
        }
      } else {
        return res.status(Status.Unauthorized).json({ message: 'User with such email is already exist!' });
      }
    };
  }
}

export const registerHandler = new RegisterHandler();
