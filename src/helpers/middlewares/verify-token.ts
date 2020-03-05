import * as jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { Status, Errors } from 'core/enums';
import { Token, VerifiedRequest } from 'models';
import { ACCESS_TOKEN_SECRET } from 'utils';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function verifyToken(req: VerifiedRequest, res: Response, next: NextFunction) {
  const token: string = req.cookies.accessToken;

  if (token) {
    try {
      const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET) as Token;

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
