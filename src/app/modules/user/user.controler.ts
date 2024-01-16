import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import { UserServices } from './user.services';

const createUser = catchAsync(async (req: Request, res: Response) => {
   const payload = req.body;

   const result = await UserServices.createUser(payload);

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   sendResponse<any>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Please cheek your emial ${payload.email} to activate your account.`,
      data: result,
   });
});
const activeUser = catchAsync(async (req: Request, res: Response) => {
   const payload = req.body;

   const result = await UserServices.activeUser(payload);

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   sendResponse<any>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `User created successfully.`,
      data: result,
   });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
   const result = await UserServices.getAllUsers();

   sendResponse<IUser[]>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Users fetch successfully..!!',
      data: result,
   });
});

const getUserInfo = catchAsync(async (req: Request, res: Response) => {
   const result = await UserServices.getUserInfo(req.params.email);

   sendResponse<IUser>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User retrive successfully..!!',
      data: result,
   });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
   const email = req.params.email;
   const updateInfo = req.body;
   const result = await UserServices.updateUser(email, updateInfo);

   sendResponse<IUser>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User updated successfully..!!',
      data: result,
   });
});
const upadateUserRole = catchAsync(async (req: Request, res: Response) => {
   const { id, role } = req.body;
   const result = await UserServices.upadateUserRole(id, role);

   sendResponse<IUser>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User role updated successfully..!!',
      data: result,
   });
});
const deleteUser = catchAsync(async (req: Request, res: Response) => {
   const result = await UserServices.deleteUser(req.params.id);

   sendResponse<IUser>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User deleted successfully..!!',
      data: result,
   });
});

const updateAvatar = catchAsync(async (req: Request, res: Response) => {
   const result = await UserServices.updateAvatar(req.params.email, req.body);

   sendResponse<IUser>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User avatar update successfully..!!',
      data: result,
   });
});

export const UserControler = {
   createUser,
   activeUser,
   getAllUsers,
   upadateUserRole,
   getUserInfo,
   updateUser,
   updateAvatar,
   deleteUser,
};
