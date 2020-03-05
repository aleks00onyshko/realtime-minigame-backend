import mongoose, { Schema, Document, model } from 'mongoose';

export interface UserModel extends Document {
  email: string;
  username: string;
  password: string;
}

const userSchema: Schema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true }
});

export const MongoUserModel: mongoose.Model<UserModel> = model<UserModel>('users', userSchema);
