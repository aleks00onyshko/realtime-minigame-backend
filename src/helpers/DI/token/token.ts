import { Type } from '../type';

// should be used in @Inject() way
export class InjectionToken {
  constructor(public injectionIdentifier: string) {}
}

export type Token<T> = Type<T> | InjectionToken;
