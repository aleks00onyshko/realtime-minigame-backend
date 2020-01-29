import { BaseHandler } from 'models';
import { Method } from 'core';
import { Request, Response, RequestHandler } from 'express';
import { TokenService } from 'core';
import { Injectable, Container } from 'DI';

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
    return async (req: Request, res: Response): Promise<Response> => {
      const { someInfo } = req.body;
      someInfo;
      return res.status(200).json({ info: 'some info' });
    }
  }
}

export const tokenHandler = Container.injectSingleton(TokenHandler);
