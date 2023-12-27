/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from 'ejs';
import { StatusCodes } from 'http-status-codes';
import { Secret } from 'jsonwebtoken';
import path from 'path';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { sendMail } from '../../../helpers/sendMail';
import { IActivationInfo, IActivationToken, IUser } from './user.interface';
import { User } from './user.model';

const createUser = async (user: IUser): Promise<any | null> => {
   const isExist = await User.findOne({ email: user.email });
   if (isExist) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exist...');
   }
   const activationToken = createActivationToken(user);

   const data = {
      name: user.name,
      otp: activationToken.otp,
   };
   await ejs.renderFile(path.join(__dirname, '../../mail/mail.ejs'), data);

   await sendMail({
      email: user.email,
      subject: 'Activate your account',
      template: 'mail.ejs',
      data,
   });

   return activationToken.token;
};

const createActivationToken = (user: IUser): IActivationToken => {
   const activationOtp = Math.floor(1000 + Math.random() * 9000).toString();

   // create access token
   const token = jwtHelpers.createToken(
      { user, activationOtp },
      config.jwt.activation_secret as Secret,
      '5m' as string
   );
   return { token, otp: activationOtp };
};

const activeUser = async (payload: IActivationInfo): Promise<IUser | null> => {
   const getUserFromJwt = jwtHelpers.verifyToken(
      payload.activationToken,
      config.jwt.activation_secret as Secret
   );
   if (payload.activationCode != getUserFromJwt.activationOtp) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid  OTP.');
   }

   const isExist = await User.findOne({ email: getUserFromJwt.user.email });
   if (isExist) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exist...');
   }

   const { name, email, password } = getUserFromJwt.user;
   const result = await User.create({ name, email, password });
   return result;
};

const getAllUsers = async (): Promise<IUser[] | null> => {
   const user = await User.find();
   return user;
};
const getUserInfo = async (email: string): Promise<IUser | null> => {
   const user = await User.findOne({ email });
   return user;
};

export const UserServices = {
   createUser,
   activeUser,
   getAllUsers,
   getUserInfo,
};
