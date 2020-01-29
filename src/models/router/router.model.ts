import { Router as ExpressRouter } from 'express';
import { BaseController } from '../controller';

export interface Router {
  expressRouter: ExpressRouter;
  setControllers: (controllers: BaseController[]) => void;
}
