import { BaseHandler, MongoUserModel, User } from 'models';
import { Method, AuthenticationService, Status, Errors } from 'core';
import { Request, Response, RequestHandler } from 'express';
import { Injectable, Container } from 'DI';

interface TokenHandlerRequest extends Request {
  body: {
    refreshToken: string;
    accessToken: string;
    user: User;
  };
}

@Injectable()
export class TokenHandler implements BaseHandler {
  public readonly path: string;
  public readonly method: Method;

  constructor(private authService: AuthenticationService) {
    this.path = '/token';
    this.method = Method.Post;
  }

  public handle(): RequestHandler {
    return async (req: TokenHandlerRequest, res: Response): Promise<Response> => {
      const { accessToken, refreshToken, user } = req.body;
      const doesUserExist = await MongoUserModel.findOne({ email: user.email });

      if (doesUserExist && this.authService.isResfreshTokenValid(refreshToken, accessToken)) {
        const accessToken = this.authService.generateAccessToken(user.email, user.username);

        this.authService.updateAccessToken(refreshToken, accessToken);

        return res.status(Status.Success).json({ accessToken });
      } else {
        return res.status(Status.Error).json({ message: Errors.RefreshTokenInvalid });
      }
    };
  }
}

export const tokenHandler = Container.injectSingleton(TokenHandler);
