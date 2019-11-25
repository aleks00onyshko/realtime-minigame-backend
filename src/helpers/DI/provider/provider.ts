import { Type } from '../type';

export interface ClassProvider<T> {
  useClass: Type<T>;
  constructedClass: T;
}

export interface ValueProvider<T> {
  useValue: T;
}

export type Provider<T> = ClassProvider<T> | ValueProvider<T>;
