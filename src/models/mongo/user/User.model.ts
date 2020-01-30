import mongoose, { Schema, Document, model } from 'mongoose';
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
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '3h' }
  );
};

userSchema.methods.generateRefreshToken = async function(): Promise<string> {
  return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2d' });
};

userSchema.methods.isPasswordValid = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.encryptPassword = async function(password: string): Promise<void> {
  this.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
};

export const MongoUserModel: mongoose.Model<UserModel> = model<UserModel>('users', userSchema);
