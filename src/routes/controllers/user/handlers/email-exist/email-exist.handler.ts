import { Errors, Method, Status } from 'core';
import { RequestHandler, Request, Response } from 'express';
import { Injectable } from 'helpers';
import { BaseHandler, MongoUserModel, UserModel } from 'models';

interface EmailExistRequest extends Request {
  body: {
    email: string;
  };
}

@Injectable()
export class EmailExistHandler implements BaseHandler {
  public readonly path: string;
  public readonly method: Method;

  constructor() {
    this.path = '/email-exist';
    this.method = Method.Get;
  }

  public handle(): RequestHandler {
    return async (req: EmailExistRequest, res: Response): Promise<Response> => {
      const { email } = req.body;
      const user: UserModel = await MongoUserModel.findOne({ email });

      return user
        ? res.status(Status.Success).json({ message: 'Email exists' })
        : res.status(Status.Error).json({ message: Errors.Error });
    };
  }
}
