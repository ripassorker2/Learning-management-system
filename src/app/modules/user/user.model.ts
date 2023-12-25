/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
   {
      name: {
         type: String,
         required: true,
      },
      role: {
         type: String,
         default: 'user',
      },
      email: {
         type: String,
         unique: true,
         required: true,
      },
      password: {
         type: String,
         required: true,
         minlength: [6, 'Password must be at list 6 characters'],
         select: 0,
      },
      avatar: {
         public_id: String,
         url: String,
      },
      isVerified: {
         type: Boolean,
         default: false,
      },
      courses: [{ courseId: String }],
   },
   {
      timestamps: true,
      toJSON: {
         virtuals: true,
      },
   }
);

userSchema.pre<IUser>('save', async function (next) {
   let user = this;
   user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
   );
   next();
});

export const User = model<IUser, UserModel>('User', userSchema);
