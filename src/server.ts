import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import { PORT, MONGO_URL } from 'utils';
import { AppRouter } from './routes';
import { Container, Injectable } from 'DI';

@Injectable()
class Server {
  public app: Application;

  private readonly port: number;

  constructor(private router: AppRouter) {
    this.app = express();
    this.port = PORT || 3000;

    this.setMiddlewares();
    this.setDatabaseConnection();
    this.setRouter();
  }

  public getPort(): number {
    return this.port;
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

export default Container.injectSingleton(Server);
