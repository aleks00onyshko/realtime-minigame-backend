import { BaseHandler, MongoUserModel, UserModel } from 'models';
import { Method, AuthenticationService, Status, Errors } from 'core';
import { Request, Response, RequestHandler } from 'express';
import { Injectable, Container } from 'DI';
import { REFRESH_TOKEN_SECRET } from 'utils';

interface TokenHandlerRequest extends Request {
  body: {
    refreshToken: string;
    accessToken: string;
    email: string;
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
      const { accessToken, refreshToken, email } = req.body;
      const user: UserModel = await MongoUserModel.findOne({ email });

      if (
        user &&
        this.authService.tokensPairExist(refreshToken, accessToken) &&
        this.authService.isTokenValid(refreshToken, REFRESH_TOKEN_SECRET)
      ) {
        const accessToken = this.authService.generateAccessToken(user.email, user.username);

        this.authService.updateAccessToken(refreshToken, accessToken);

        return res.status(Status.Success).json({ accessToken, refreshToken });
      } else {
        return res.status(Status.Error).json({ message: Errors.RefreshTokenInvalid });
      }
    };
  }
}

export const tokenHandler = Container.injectSingleton(TokenHandler);
