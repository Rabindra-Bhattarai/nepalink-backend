import mongoose, { Document, Schema } from "mongoose";

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },       // matches Dart `name`
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },      // matches Dart `phone`
    password: { type: String, required: true },   // matches Dart `password`
  },
  {
    timestamps: true,
  }
);

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;  // maps to Dart `id`
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export const UserModel = mongoose.model<IUser>("User", UserSchema);