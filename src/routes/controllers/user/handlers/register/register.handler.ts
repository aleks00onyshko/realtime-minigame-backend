import { RequestHandler, Request, Response } from 'express';

import { BaseHandler, MongoUserModel, UserModel } from 'models';
import { Method, Status, Errors } from 'core/enums';
import { AuthenticationService } from 'core';
import { Injectable } from 'DI';

interface RegisterRequest extends Request {
  body: {
    email: string;
    password: string;
    username: string;
  };
}

@Injectable()
export class RegisterHandler implements BaseHandler {
  public readonly path: string;
  public readonly method: Method;

  constructor(private authenticationService: AuthenticationService) {
    this.path = '/register';
    this.method = Method.Post;
  }

  public handle(): RequestHandler {
    return async (req: RegisterRequest, res: Response): Promise<Response> => {
      const { email, password, username } = req.body;

      const user: UserModel = await MongoUserModel.findOne({ email });

      if (!user) {
        const newUser: UserModel = new MongoUserModel({ email, password, username });

        newUser.password = await this.authenticationService.encryptPassword(password);

        const user: UserModel = await newUser.save();

        if (user) {
          const tokens = this.authenticationService.generateTokens();

          this.authenticationService.addTokensPair(tokens);

          return res.status(Status.Success).json({ ...tokens });
        } else {
          return res.status(Status.Error).json({ message: Errors.Error });
        }
      } else {
        return res.status(Status.Unauthorized).json({ message: Errors.UserDoesNotExist });
      }
    };
  }
}
