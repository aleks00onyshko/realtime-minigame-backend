import { BaseHandler } from 'models';
import { Method, AuthenticationService, Status, Errors } from 'core';
import { Request, Response, RequestHandler } from 'express';
import { Injectable, Container } from 'DI';

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

  constructor(private authenticationService: AuthenticationService) {
    this.path = '/token';
    this.method = Method.Post;
  }

  public handle(): RequestHandler {
    return async (req: TokenHandlerRequest, res: Response): Promise<Response> => {
      const { accessToken: oldAccessToken, refreshToken: oldRefreshToken } = req.body;
      const tokensPairExist = this.authenticationService.tokensPairExist({
        accessToken: oldAccessToken,
        refreshToken: oldRefreshToken
      });

      if (tokensPairExist) {
        const tokens = this.authenticationService.generateTokens();

        this.authenticationService.removeTokensPair(oldRefreshToken);
        this.authenticationService.addTokensPair(tokens);

        return res.status(Status.Success).json({ ...tokens });
      } else {
        return res.status(Status.Error).json({ message: Errors.RefreshTokenInvalid });
      }
    };
  }
}

export const tokenHandler = Container.injectSingleton(TokenHandler);
