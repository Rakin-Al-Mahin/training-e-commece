import { Schema, model } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { IUser } from './auth.interface';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(ENUM_USER_ROLE),
      default: ENUM_USER_ROLE.CUSTOMER,
    },
  },
  {
    timestamps: true,
    // toJSON: {
    //   virtuals: true,
    //   transform: function (doc, ret) {
    //     delete ret.password;
    //     return ret;
    //   },
    // },
  }
);

export const User = model<IUser>('User', userSchema);
