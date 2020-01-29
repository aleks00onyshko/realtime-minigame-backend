import { Injectable, Container } from 'DI';

type RefreshTokensList = {
  [key: string]: string;
};

@Injectable()
export class TokenService {
  public refreshTokenList: RefreshTokensList;

  constructor() {
    this.refreshTokenList = {
      someProperty: 'some value'
    };
  }

  public addRefresToken(token: string, email: string): void {
    this.refreshTokenList[token] = email;
  }

  public removeRefreshToken(token: string): void {
    delete this.refreshTokenList[token];
  }
}

export const tokenService = Container.injectSingleton(TokenService);
