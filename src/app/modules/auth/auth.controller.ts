import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import config from '../../../config';
import { catchAsync } from '../../../shared/catchAsync';
import { redis } from '../../../shared/redis';
import { sendResponse } from '../../../shared/sendResponse';
import { ILoginResponse, IRefreshToken } from './auth.interface';
import { AuthServices } from './auth.services';

const loginUser = catchAsync(async (req: Request, res: Response) => {
   const { ...loginData } = req.body;

   const result = await AuthServices.loginUser(loginData);

   // set refresh token into cookie
   const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
   };
   res.cookie('accessToken', result?.accessToken, cookieOptions);
   res.cookie('refreshToken', result?.refreshToken, cookieOptions);

   if (result?.refreshToken) {
      delete result?.refreshToken;
   }

   sendResponse<ILoginResponse>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User logged successfully..!!',
      data: result,
   });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
   const { refreshToken } = req.cookies;

   const result = await AuthServices.refreshToken(refreshToken);

   // set refresh token into cookie
   const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
   };
   res.cookie('accessToken', result?.accessToken, cookieOptions);
   res.cookie('refreshToken', result?.refreshToken, cookieOptions);

   if (result?.refreshToken) {
      delete result?.refreshToken;
   }

   sendResponse<IRefreshToken>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Get access token successfully..!!',
      data: result,
   });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
   const user = req.user;
   const { ...passwordData } = req.body;

   await AuthServices.changePassword(user, passwordData);

   sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Password changed successfully !',
   });
});
const logOut = catchAsync(async (req: Request, res: Response) => {
   redis.del(req.user?.email);
   res.cookie('accessToken', '');
   res.cookie('refreshToken', '');
   sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Logout successfully !',
   });
});

const socialAuth = catchAsync(async (req: Request, res: Response) => {
   const user = req.body;

   const result = await AuthServices.socialAuth(user);
   // set refresh token into cookie
   const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
   };
   res.cookie('accessToken', result?.accessToken, cookieOptions);
   res.cookie('refreshToken', result?.refreshToken, cookieOptions);

   if (result?.refreshToken) {
      delete result?.refreshToken;
   }

   sendResponse<ILoginResponse>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Social logged successfully..!!',
      data: result,
   });
});

export const AuthController = {
   loginUser,
   refreshToken,
   changePassword,
   logOut,
   socialAuth,
};
