import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { AppRouter } from './routes';
import { Container, Injectable } from './helpers';

@Injectable()
class Server {
  public app: Application;

  private readonly port: number;

  constructor(private router: AppRouter) {
    this.app = express();
    this.port = +process.env.PORT || 3000;

    this.setMiddlewares();
    this.setDatabaseConnection();
    this.setRouter();
  }

  public getPort(): number {
    return this.port;
  }

  private setMiddlewares(): void {
    dotenv.config();
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private setDatabaseConnection(): void {
    mongoose.connect(process.env.MONGO_URL, () => {
      console.log('Successfully connected to MongoDb');
    });
  }

  private setRouter(): void {
    this.app.use('/api', this.router.expressRouter);
  }
}

export default Container.injectSingleton(Server);
console.log(Container.providers);
