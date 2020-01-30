import mongoose, { Schema, Document, model } from 'mongoose';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import { User } from './user.interface';

export interface UserModel extends User, Document {
  generateAccessToken: () => Promise<string>;
  generateRefreshToken: () => Promise<string>;
  isPasswordValid: (password: string) => Promise<boolean>;
  encryptPassword: (password: string) => Promise<void>;
}

const userSchema: Schema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true }
});

userSchema.methods.generateAccessToken = async function(): Promise<string> {
  const pathToSecret = path.join(__dirname, '../../../config/keys', 'access-private.key');
  const privateKey = await fs.readFile(pathToSecret);

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username
    },
    privateKey,
    { expiresIn: '3h' }
  );
};

userSchema.methods.generateRefreshToken = async function(): Promise<string> {
  const pathToSecret = path.join(__dirname, '../../../config/keys', 'refresh-private.key');
  const privateKey = await fs.readFile(pathToSecret);

  return jwt.sign({}, privateKey, { expiresIn: '2d' });
};

userSchema.methods.isPasswordValid = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.encryptPassword = async function(password: string): Promise<void> {
  this.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
};

export const MongoUserModel: mongoose.Model<UserModel> = model<UserModel>('users', userSchema);
