import { Type } from '../type';

export class InjectionToken {
  constructor(public injectionIdentifier: string) {}
}

export type Token<T> = Type<T> | InjectionToken;
