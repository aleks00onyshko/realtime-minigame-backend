import { Request } from 'express';
import { Token } from '../token';

export interface VerifiedRequest extends Request {
  locals: {
    tokenInfo: Token | null;
  };
}
