import { Request } from 'express';

export interface AppRequest extends Request {
  locals: {
    tokenInfo: object | null;
  };
}
