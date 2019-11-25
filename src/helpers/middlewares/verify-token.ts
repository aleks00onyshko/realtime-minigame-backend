import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { accessTokenSecret } from '../../config';
import { AppRequest } from '../../models';

export async function verifyToken(req: AppRequest, res: Response, next: NextFunction) {
  const token: string = req.headers.authorization;

  if (token) {
    try {
      const decodedToken = <object>jwt.verify(token, accessTokenSecret);

      req.locals = {
        tokenInfo: { ...decodedToken }
      };

      next();
    } catch (error) {
      return res.status(401).json(error);
    }
  }
}
