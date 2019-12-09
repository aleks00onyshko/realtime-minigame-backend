import { promises as fs } from 'fs';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

import { AppRequest } from 'models';

export async function verifyToken(req: AppRequest, res: Response, next: NextFunction) {
  const token: string = req.headers.authorization;

  if (token) {
    try {
      const pathToSecret = path.join(__dirname, '../../config/keys', 'private.key');
      const privateKey = await fs.readFile(pathToSecret, 'utf8');
      const decodedToken = jwt.verify(token, privateKey) as object;

      req.locals = {
        tokenInfo: { ...decodedToken }
      };

      next();
    } catch (error) {
      return res.status(401).json(error);
    }
  }
}
