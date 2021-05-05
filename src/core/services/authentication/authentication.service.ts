import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { createTransport, Transporter, SentMessageInfo } from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  GMAIL_SENDER_PASSWORD,
  GMAIL_REFRESH_TOKEN,
  GMAIL_CLIENT_SECRET,
  GMAIL_CLIENT_ID,
  GMAIL_SENDER_EMAIL
} from 'utils';
import { Injectable, Container } from 'DI';
import { Tokens } from 'models';

@Injectable()
export class AuthenticationService {
  public tokensMap = new Map<string, string>();
  public authenticationCodeMap = new Map<string, number>();

  public addTokensPair(tokens: Tokens): void {
    const { accessToken, refreshToken } = tokens;

    this.tokensMap.set(refreshToken, accessToken);
  }

  public removeTokensPair(refreshToken: string): void {
    this.tokensMap.delete(refreshToken);
  }

  public tokensPairExist(tokens: Tokens): boolean {
    const { accessToken, refreshToken } = tokens;

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

  public generateAccessToken(): string {
    return jwt.sign({}, ACCESS_TOKEN_SECRET, {
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

  public generateTokens(): Tokens {
    const accessToken: string = this.generateAccessToken();
    const refreshToken: string = this.generateRefreshToken();

    return { accessToken, refreshToken };
  }

  public generateAuthenticationCode(): number {
    return Number(
      Math.random()
        .toString()
        .substr(2, 6)
    );
  }

  public addAuthenticationCode(email: string, authenticationCode: number): void {
    this.authenticationCodeMap.set(email, authenticationCode);
  }

  public authenticationCodeValid(email: string, authenticationCode: number): boolean {
    return (
      this.authenticationCodeMap.has(email) &&
      this.authenticationCodeMap.get(email) === authenticationCode
    );
  }

  public sendAuthenticationCodeViaEmail(
    email: string,
    authenticationCode: number
  ): Promise<SentMessageInfo> {
    const transporter = this.createNodemailerTransporter();
    const options = this.createMailOptions(email, authenticationCode);

    return transporter.sendMail(options);
  }

  public async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, await bcrypt.genSalt(10));
  }

  public async isPasswordValid(password: string, encryptedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, encryptedPassword);
  }

  private createNodemailerTransporter(): Transporter {
    return createTransport(
      smtpTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: GMAIL_SENDER_EMAIL,
          pass: GMAIL_SENDER_PASSWORD,
          clientId: GMAIL_CLIENT_ID,
          clientSecret: GMAIL_CLIENT_SECRET,
          refreshToken: GMAIL_REFRESH_TOKEN
        }
      })
    );
  }

  private createMailOptions(
    email: string,
    authenticationCode: number
  ): Record<string, string | number> {
    return {
      from: GMAIL_SENDER_EMAIL,
      to: email,
      subject: 'Authentication Code',
      text: authenticationCode.toString()
    };
  }
}

Container.injectSingleton(AuthenticationService);
