import { BaseHandler } from 'models';
import { LoginHandler } from './login';
import { RegisterHandler } from './register';
import { TokenHandler } from './token';
import { VerifyAuthenticationCodeHandler } from './verify-authentication-code';
import { VerifyEmailHandler } from './verify-email';
import { EmailExistHandler } from './email-exist';
import { Container, Type } from 'helpers';

export const handlers: BaseHandler[] = [
  LoginHandler,
  RegisterHandler,
  TokenHandler,
  VerifyEmailHandler,
  VerifyAuthenticationCodeHandler,
  EmailExistHandler
].map((handler: Type<BaseHandler>) => Container.injectSingleton(handler));
