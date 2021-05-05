import * as dotenv from 'dotenv';

dotenv.config();

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRATION_TIME = +process.env.ACCESS_TOKEN_EXPIRATION_TIME;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRATION_TIME = +process.env.REFRESH_TOKEN_EXPIRATION_TIME;
export const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
export const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
export const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
export const GMAIL_ACCESS_TOKEN = process.env.GMAIL_ACCESS_TOKEN;
export const GMAIL_SENDER_PASSWORD = process.env.GMAIL_SENDER_PASSWORD;
export const GMAIL_SENDER_EMAIL = process.env.GMAIL_SENDER_EMAIL;
export const MONGO_URL = process.env.MONGO_URL;
export const PORT = +process.env.PORT;
