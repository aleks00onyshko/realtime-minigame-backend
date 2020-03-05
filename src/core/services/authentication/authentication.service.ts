import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET
} from 'utils';
import { Injectable, Container } from 'DI';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthenticationService {
  public tokensMap = new Map<string, string>();
  public test = false;

  public addTokensPair(refreshToken: string, accessToken: string): void {
    this.tokensMap.set(refreshToken, accessToken);
  }

  public removeTokensPair(refreshToken: string): void {
    this.tokensMap.delete(refreshToken);
  }

  public isResfreshTokenValid(refreshToken: string, accessToken: string): boolean {
    console.log('token map', this.tokensMap);
    console.log('auth service', this.tokensMap.has(refreshToken) && this.tokensMap.get(refreshToken) === accessToken);

    return (
      this.tokensMap.has(refreshToken) &&
      this.tokensMap.get(refreshToken) === accessToken &&
      !(jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) instanceof Error)
    );
  }

  public generateAccessToken(email: string, username: string): string {
    return jwt.sign({ email, username }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
      algorithm: 'HS256'
    });
  }

  public generateRefreshToken(): string {
    return jwt.sign({}, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
      algorithm: 'HS256'
    });
  }

  public generateTokens(email: string, username: string): Tokens {
    const accessToken = this.generateAccessToken(email, username);
    const refreshToken = this.generateRefreshToken();

    return { accessToken, refreshToken };
  }

  public updateAccessToken(refreshToken: string, accessToken: string): void {
    this.tokensMap.set(refreshToken, accessToken);
  }

  public async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, await bcrypt.genSalt(10));
  }

  public async isPasswordValid(password: string, encryptedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, encryptedPassword);
  }
}

Container.injectSingleton(AuthenticationService);
