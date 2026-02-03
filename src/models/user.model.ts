import mongoose, { Document, Schema } from "mongoose";
import bcryptjs from "bcryptjs";

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    imageUrl: { type: String, default: "default-profile.png" },
    role: {
      type: String,
      enum: ["nurse", "member", "admin"],
      default: "nurse", // existing users (Flutter) will be nurses by default
    },
  },
  {
    timestamps: true,
  }
);


export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  imageUrl?: string;
  role: "nurse" | "member" | "admin" ;
  createdAt: Date;
  updatedAt: Date;
}

export const UserModel = mongoose.model<IUser>("User", UserSchema);
