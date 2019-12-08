import 'reflect-metadata';

import { Token } from './token';
import { ClassProvider, Provider, ValueProvider } from './provider';
import { Type } from './type';
import { INJECT_METADATA_KEY } from './decorator';

export const Container = new (class {
  public providers = new Map<Token<any>, Provider<any>>();

  public injectSingleton<T>(classToUse: Type<T>): T {
    return this.resolve(classToUse).constructedClass;
  }

  public injectValue<T>(token: Token<T>, value: T): T {
    if (this.providers.get(token)) {
      return (this.providers.get(token) as ValueProvider<T>).useValue;
    }

    this.providers.set(token, { useValue: value });

    return (this.providers.get(token) as ValueProvider<T>).useValue;
  }

  // can't use primitive value in the constructor yet
  private resolve<T>(target: Type<T>): ClassProvider<T> {
    const deps = Reflect.getMetadata('design:paramtypes', target) || [];

    const constructedClass = new target(
      ...deps.map((dep: Type<T>, index: number) => {
        // it handles circular dependency, actually I don't know how yet :))
        if (dep === undefined) {
          throw new Error(`Recursive dependency detected in constructor for type ${target.name} at index ${index}`);
        }

        const injectionToken = this.getInjectionToken(target, index);

        if (injectionToken) {
          return (this.providers.get(injectionToken) as ValueProvider<T>).useValue;
        }

        return this.resolve(dep).constructedClass;
      })
    );
    this.providers.set(target, { useClass: target, constructedClass });

    return this.providers.get(target) as ClassProvider<T>;
  }

  private getInjectionToken(target: any, index: number) {
    return Reflect.getMetadata(INJECT_METADATA_KEY, target, `index-${index}`) as Token<any> | undefined;
  }
})();
