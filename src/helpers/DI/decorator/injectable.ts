/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import 'reflect-metadata';

import { Container } from '../container';

export const INJECTABLE_METADATA_KEY = Symbol('INJECTABLE_KEY');
export function Injectable() {
  return function(target: any) {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);

    Container.injectSingleton(target);
  };
}
