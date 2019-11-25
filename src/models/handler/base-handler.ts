import { RequestHandler } from 'express';
import { Method } from '../../core';

export interface BaseHandler {
  path: string;
  method: Method;
  handle: () => RequestHandler;
}
