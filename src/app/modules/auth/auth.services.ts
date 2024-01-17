import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { redis } from '../../../shared/redis';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { IChangePassword, ILoginResponse, ILoginUser } from './auth.interface';

const loginUser = async (
   payload: ILoginUser
): Promise<ILoginResponse | null> => {
   const { email, password } = payload;

   const isUserExist = await User.findOne({ email }, { password: 1, role: 1 });

   if (!isUserExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User does not exist');
   }

   let isPasswordMatched;
   if (isUserExist.password) {
      isPasswordMatched = await bcrypt.compare(password, isUserExist.password);
   }

   if (!isPasswordMatched) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Password is incorrect');
   }
   const redisUser = await User.findOne({ email });

   redis.set(email, JSON.stringify(redisUser), 'EX', 604800);

   // create access token
   const accessToken = jwtHelpers.createToken(
      { email, role: isUserExist?.role },
      config.jwt.secret_token as Secret,
      config.jwt.secret_expires as string
   );

   const refreshToken = jwtHelpers.createToken(
      { email, role: isUserExist?.role },
      config.jwt.refresh_token as Secret,
      config.jwt.refresh_expires as string
   );

   return {
      refreshToken,
      accessToken,
   };
};

const refreshToken = async (token: string): Promise<ILoginResponse | null> => {
   let verifiedToken = null;
   try {
      verifiedToken = jwtHelpers.verifyToken(
         token,
         config.jwt.refresh_token as Secret
      );
   } catch (err) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid Refresh Token');
   }
   const { email } = verifiedToken;

   // tumi delete hye gso  kintu tumar refresh token ase
   // checking deleted user's refresh token

   const isUserExist = await User.findOne({ email }, { role: 1 });
   if (!isUserExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User does not exist');
   }

   //generate new token

   const accessToken = jwtHelpers.createToken(
      { email, role: isUserExist?.role },
      config.jwt.secret_token as Secret,
      config.jwt.secret_expires as string
   );

   const refreshToken = jwtHelpers.createToken(
      { email, role: isUserExist?.role },
      config.jwt.refresh_token as Secret,
      config.jwt.refresh_expires as string
   );

   const redisUser = await User.findOne({ email });
   redis.set(email, JSON.stringify(redisUser), 'EX', 604800);

   return {
      refreshToken,
      accessToken,
   };
};

const changePassword = async (
   user: JwtPayload | null,
   payload: IChangePassword
): Promise<void> => {
   const { oldPassword, newPassword } = payload;

   // // checking is user exist
   const isUserExist = await User.findOne(
      { email: user?.email },
      { password: 1, role: 1 }
   );

   if (!isUserExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User does not exist');
   }

   // checking old password
   let isPasswordMatched;
   if (isUserExist.password) {
      isPasswordMatched = await bcrypt.compare(
         oldPassword,
         isUserExist.password
      );
   }

   if (!isPasswordMatched) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Password is incorrect');
   }

   // hash password before saving
   const newHashedPassword = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_rounds)
   );

   const query = { email: user?.email };

   await User.findOneAndUpdate(query, {
      password: newHashedPassword,
   });
};
const socialAuth = async (user: IUser): Promise<ILoginResponse | null> => {
   const { email } = user;
   let isUserExist = null;
   isUserExist = await User.findOne({ email });

   // create access token
   const accessToken = jwtHelpers.createToken(
      { email, role: 'user' },
      config.jwt.secret_token as Secret,
      config.jwt.secret_expires as string
   );

   const refreshToken = jwtHelpers.createToken(
      { email, role: 'user' },
      config.jwt.refresh_token as Secret,
      config.jwt.refresh_expires as string
   );

   if (!isUserExist) {
      await User.create(user);
      return {
         refreshToken,
         accessToken,
      };
   }

   return {
      refreshToken,
      accessToken,
   };
};

export const AuthServices = {
   loginUser,
   refreshToken,
   changePassword,
   socialAuth,
};
