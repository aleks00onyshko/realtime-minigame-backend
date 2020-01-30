import { RequestHandler } from 'express';
import { Method } from 'core/enums';

export interface BaseHandler {
  path: string;
  method: Method;
  handle: () => RequestHandler;
}
