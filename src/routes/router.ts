import { Router as ExpressRouter } from 'express';
import { Container, Injectable } from 'DI';
import { Router, BaseController } from 'models';

import { controllers } from './controllers';

@Injectable()
export class AppRouter implements Router {
  public expressRouter: ExpressRouter;

  constructor() {
    this.expressRouter = ExpressRouter();
    this.setControllers(controllers);
  }

  setControllers(controllers: BaseController[]): void {
    controllers.forEach((controller: BaseController) => {
      this.expressRouter.use(controller.path, controller.expressRouter);
      console.log('hello');
    });
  }
}

export const appRouter = Container.injectSingleton(AppRouter);
