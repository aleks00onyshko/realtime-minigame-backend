import mongoose, { Schema, Document, model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import { accessTokenSecret } from '../../../config';
import { IUser } from './user.interface';

export interface IUserModel extends IUser, Document {
  generateAccessToken: () => string;
  isPasswordValid: (password: string) => Promise<boolean>;
  encryptPassword: (password: string) => Promise<void>;
}

const userSchema: Schema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true }
});

userSchema.methods.generateAccessToken = function(): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username
    },
    accessTokenSecret,
    { expiresIn: '3h' }
  );
};

userSchema.methods.isPasswordValid = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.encryptPassword = async function(password: string): Promise<void> {
  this.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
};

export const User: mongoose.Model<IUserModel> = model<IUserModel>('users', userSchema);
