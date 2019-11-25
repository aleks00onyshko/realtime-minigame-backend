import 'reflect-metadata';

import { Token } from './token';
import { ClassProvider, Provider, ValueProvider } from './provider';
import { Type } from './type';

export const Container = new (class {
  public providers = new Map<Token<any>, Provider<any>>();

  public injectSingleton<T>(classToUse: Type<T>): T {
    return this.resolve(classToUse).constructedClass;
  }

  // TODO: is working, but should be migrated to @Inject way
  public injectValue<T>(token: Token<T>, value: T): T {
    if (this.providers.get(token)) {
      return (this.providers.get(token) as ValueProvider<T>).useValue;
    }

    this.providers.set(token, { useValue: value });
    console.log(this.providers);

    return (this.providers.get(token) as ValueProvider<T>).useValue;
  }

  private resolve<T>(target: Type<T>): ClassProvider<T> {
    const deps = Reflect.getMetadata('design:paramtypes', target) || [];

    if (this.providers.get(target)) {
      return this.providers.get(target) as ClassProvider<T>;
    }

    const constructedClass = new target(...deps.map((dep: Type<T>) => this.resolve(dep).constructedClass));
    this.providers.set(target, { useClass: target, constructedClass });

    return this.providers.get(target) as ClassProvider<T>;
  }
})();
