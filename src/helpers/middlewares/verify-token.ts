import { promises as fs } from 'fs';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { Status } from 'core/enums';

import { AppRequest } from 'models';

export async function verifyToken(req: AppRequest, res: Response, next: NextFunction) {
  const token: string = req.headers.authorization;

  if (token) {
    try {
      const pathToSecret = path.join(__dirname, '../../config/keys', 'access-private.key');
      const privateKey = await fs.readFile(pathToSecret, 'utf8');
      const decodedToken = jwt.verify(token, privateKey) as object;

      req.locals = {
        tokenInfo: { ...decodedToken }
      };

      next();
    } catch (error) {
      return res.status(Status.Unauthorized).json(error);
    }
  }
}
