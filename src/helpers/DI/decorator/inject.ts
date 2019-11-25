import { Token } from '../token';

const INJECT_METADATA_KEY = Symbol('INJECT_KEY');

// it is interesting approach, because it seems to me, that Reflect defines
// `index-${index}` => index-1 property of the class under the hood.
// the issue is, that propertyKey of defineMetadata of the constructoe is undefined
// It is needed to be discussed
export function Inject(token: Token<any>) {
  return function(target: any, _: string | symbol, index: number) {
    Reflect.defineMetadata(INJECT_METADATA_KEY, token, target, `index-${index}`);
    return target;
  };
}

export function getInjectionToken(target: any, index: number) {
  return Reflect.getMetadata(INJECT_METADATA_KEY, target, `index-${index}`) as Token<any> | undefined;
}
