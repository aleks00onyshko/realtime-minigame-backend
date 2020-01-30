import { BaseHandler } from 'models';
import { Method, TokenService } from 'core';
import { Request, Response, RequestHandler } from 'express';
import { Injectable, Container } from 'DI';
import { Status } from 'core/enums';

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
      return res.status(Status.Success).json({ info: 'some info' });
    };
  }
}

export const tokenHandler = Container.injectSingleton(TokenHandler);
