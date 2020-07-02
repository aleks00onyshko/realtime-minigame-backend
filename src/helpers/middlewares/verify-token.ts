import * as jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { Status, Errors } from 'core/enums';
import { Token, VerifiedRequest } from 'models';
import { ACCESS_TOKEN_SECRET } from 'utils';

export async function verifyToken(
  req: VerifiedRequest,
  res: Response,
  next: NextFunction
): Promise<never | Response> {
  const { authorization: accessToken } = req.headers;

  if (accessToken) {
    try {
      const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as Token;

      req.locals = {
        tokenInfo: { ...decodedToken }
      };

      next();
    } catch (error) {
      return res.status(Status.Unauthorized).json({ message: Errors.AccessTokenInvalid });
    }
  } else {
    return res.status(Status.Unauthorized).json({ message: Errors.Error });
  }
}
