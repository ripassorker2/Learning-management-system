import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { INotification } from './interface';
import { NotificationServices } from './services';

const getAllNotification = catchAsync(async (req: Request, res: Response) => {
   const result = await NotificationServices.getAllNotification();

   sendResponse<INotification[]>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Notifications retrive succesfully.`,
      data: result,
   });
});
const updateNotification = catchAsync(async (req: Request, res: Response) => {
   const result = await NotificationServices.updateNotification(req.params.id);

   sendResponse<INotification[]>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Notifications update succesfully.`,
      data: result,
   });
});

export const NotificationController = {
   getAllNotification,
   updateNotification,
};
