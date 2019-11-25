import { BaseHandler } from '../../../../models';
import { loginHandler } from './login';
import { registerHandler } from './register';

export const handlers: BaseHandler[] = [loginHandler, registerHandler];
