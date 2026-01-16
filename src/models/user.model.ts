import mongoose, { Document, Schema } from "mongoose";

const UserSchema: Schema = new Schema(
  {
    userid: { type: String }, // optional UUID, can mirror Flutter Hive
    name: { type: String },   // ✅ matches Flutter Hive
    email: { type: String, required: true, unique: true },
    phone: { type: String },  // ✅ matches Flutter Hive
    password: { type: String, required: true },
    // keep existing fields for web
    username: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  userid?: string;
  name?: string;
  email: string;
  phone?: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export const UserModel = mongoose.model<IUser>("User", UserSchema);
