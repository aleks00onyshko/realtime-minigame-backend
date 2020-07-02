import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET
} from 'utils';
import { Injectable, Container } from 'DI';
import { Tokens } from 'models';

@Injectable()
export class AuthenticationService {
  public tokensMap = new Map<string, string>();

  public addTokensPair(refreshToken: string, accessToken: string): void {
    this.tokensMap.set(refreshToken, accessToken);
  }

  public removeTokensPair(refreshToken: string): void {
    this.tokensMap.delete(refreshToken);
  }

  public tokensPairExist(refreshToken: string, accessToken: string): boolean {
    return this.tokensMap.has(refreshToken) && this.tokensMap.get(refreshToken) === accessToken;
  }

  public isTokenValid(token: string, secret: string): boolean {
    try {
      jwt.verify(token, secret);
      return true;
    } catch {
      return false;
    }
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
    const accessToken: string = this.generateAccessToken(email, username);
    const refreshToken: string = this.generateRefreshToken();

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
