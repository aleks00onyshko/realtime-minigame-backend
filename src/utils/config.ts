import * as dotenv from 'dotenv';

dotenv.config();

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRATION_TIME = +process.env.ACCESS_TOKEN_EXPIRATION_TIME;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRATION_TIME = +process.env.REFRESH_TOKEN_EXPIRATION_TIME;
export const MONGO_URL = process.env.MONGO_URL;
export const PORT = +process.env.PORT;
