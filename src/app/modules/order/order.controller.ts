import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { ICourses } from '../courses/courses.interface';
import { IOrder } from './order.interface';
import { OrderServices } from './order.services';

const createOrder = catchAsync(async (req: Request, res: Response) => {
   const result = await OrderServices.createOrder(req.body);

   sendResponse<ICourses>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Course order succesfully.`,
      data: result,
   });
});
const getAllOrder = catchAsync(async (req: Request, res: Response) => {
   const result = await OrderServices.getAllOrder();

   sendResponse<IOrder[]>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `All order retrive succesfully.`,
      data: result,
   });
});

export const OrderController = {
   createOrder,
   getAllOrder,
};
