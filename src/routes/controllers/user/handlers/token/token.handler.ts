import { BaseHandler } from 'models';
import { Method, TokenService } from 'core';
import { Request, Response, RequestHandler } from 'express';
import { Injectable, Container } from 'DI';
import { Status } from 'core/enums';

interface TokenHandlerRequest extends Request {
  body: {
    refreshToken: string;
    email: string;
  };
}

@Injectable()
export class TokenHandler implements BaseHandler {
  public readonly path: string;
  public readonly method: Method;

  constructor(private tokenService: TokenService) {
    this.path = '/token';
    this.method = Method.Post;
    this.tokenService;
  }

  public handle(): RequestHandler {
    return async (req: TokenHandlerRequest, res: Response): Promise<Response> => {
      console.log('cookies', req.cookies);
      return res.status(Status.Success).json({ info: 'some info' });
    };
  }
}

export const tokenHandler = Container.injectSingleton(TokenHandler);
