import 'reflect-metadata';

import { Token } from './token';
import { ClassProvider, Provider, ValueProvider } from './provider';
import { Type } from './type';
import { INJECT_METADATA_KEY } from './decorator';

export const Container = new (class {
  public providers = new Map<Token<unknown>, Provider<unknown>>();

  public injectSingleton<T>(classToUse: Type<T>): T {
    if (this.providers.get(classToUse)) {
      return (this.providers.get(classToUse) as ClassProvider<T>).constructedClass;
    }

    return this.resolve(classToUse).constructedClass;
  }

  public injectValue<T>(token: Token<T>, value: T): T {
    if (this.providers.get(token)) {
      return (this.providers.get(token) as ValueProvider<T>).useValue;
    }

    this.providers.set(token, { useValue: value });

    return (this.providers.get(token) as ValueProvider<T>).useValue;
  }

  private resolve<T>(target: Type<T>): ClassProvider<T> {
    const deps = Reflect.getMetadata('design:paramtypes', target) || [];

    // checking if child dependency exists when resolve is called recursively,
    // because when some class is dependent on others classes, it is going to be replaced every time
    // when each class is resolved without this check. Yes, I know, unit tests are needed!!!
    if (this.providers.get(target)) {
      return this.providers.get(target) as ClassProvider<T>;
    }
    const constructedClass = new target(
      ...deps.map((dep: Type<T>, index: number) => {
        // it handles circular dependency
        if (dep === undefined) {
          throw new Error(
            `Recursive dependency detected in constructor for type ${target.name} at index ${index}`
          );
        }

        const injectionToken = this.getInjectionToken<T>(target, index);

        if (injectionToken) {
          return (this.providers.get(injectionToken) as ValueProvider<T>).useValue;
        }

        return this.resolve(dep).constructedClass;
      })
    );

    this.providers.set(target, {
      useClass: target,
      constructedClass
    });

    return this.providers.get(target) as ClassProvider<T>;
  }

  private getInjectionToken<T>(target: Type<T>, index: number): Token<unknown> {
    return Reflect.getMetadata(INJECT_METADATA_KEY, target, `index-${index}`) as Token<unknown>;
  }
})();
