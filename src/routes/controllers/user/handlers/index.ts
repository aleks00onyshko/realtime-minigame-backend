import { BaseHandler } from 'models';
import { loginHandler } from './login';
import { registerHandler } from './register';
import { tokenHandler } from './token';
import { verifyAuthenticationCodeHandler } from './verify-authentication-code';
import { verifyEmailHandler } from './verify-email';

export const handlers: BaseHandler[] = [
  loginHandler,
  registerHandler,
  tokenHandler,
  verifyEmailHandler,
  verifyAuthenticationCodeHandler
];
