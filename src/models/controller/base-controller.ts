import { Router as ExpressRouter } from 'express';

import { BaseHandler } from '../handler';

export interface BaseController {
  path: string;
  expressRouter: ExpressRouter;
  setHandlers: (handlers: BaseHandler[]) => void;
}
