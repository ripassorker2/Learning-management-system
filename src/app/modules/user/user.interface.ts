import { Model } from 'mongoose';

export type IUser = {
   name: string;
   role: string;
   email: string;
   password: string;
   avatar?: {
      public_id: string;
      url: string;
   };
   isVerified?: boolean;
   courses?: Array<{ courseId: string }>;
};

export type UserModel = Model<IUser, Record<string, unknown>>;

export type IActivationToken = {
   token: string;
   otp: string;
};

export type IActivationInfo = {
   activationToken: string;
   activationCode: string;
};
