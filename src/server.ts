import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import { PORT, MONGO_URL } from 'utils';
import { AppRouter } from './routes';
import { Injectable } from 'DI';

@Injectable()
export class Server {
  public app: Application;

  private readonly _port: number;

  constructor(private router: AppRouter) {
    this.app = express();
    this._port = PORT || 3000;

    this.setMiddlewares();
    this.setDatabaseConnection();
    this.setRouter();
  }

  public get port(): number {
    return this._port;
  }

  private setMiddlewares(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private setDatabaseConnection(): void {
    mongoose.connect(MONGO_URL, () => {
      console.log('Successfully connected to MongoDb');
    });
  }

  private setRouter(): void {
    this.app.use('/api', this.router.expressRouter);
  }
}
