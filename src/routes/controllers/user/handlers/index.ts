import { BaseHandler } from 'models';
import { loginHandler } from './login';
import { registerHandler } from './register';
import { tokenHandler } from './token';

export const handlers: BaseHandler[] = [loginHandler, registerHandler, tokenHandler];
