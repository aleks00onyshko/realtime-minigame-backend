import { Router as ExpressRouter } from 'express';

import { BaseController, BaseHandler } from 'models';
import { handlers } from './handlers';

export class UserController implements BaseController {
  public path: string;
  public expressRouter: ExpressRouter;

  constructor() {
    this.path = '/users';
    this.expressRouter = ExpressRouter();
    this.setHandlers(handlers);
  }

  public setHandlers(handlers: BaseHandler[]): void {
    handlers.forEach((handler: BaseHandler) => {
      this.expressRouter[handler.method](handler.path, handler.handle());
    });
  }
}

export const userController = new UserController();
