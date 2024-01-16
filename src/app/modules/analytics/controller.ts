import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { generate12MonthData } from '../../../helpers/genarated12MonthAnalytics';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { Course } from '../courses/courses.model';
import { Order } from '../order/order.model';
import { User } from '../user/user.model';

const getUserAnalytics = catchAsync(async (req: Request, res: Response) => {
   const result = await generate12MonthData(User);
   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Fetch all user analitics successfully..`,
      data: result,
   });
});
const getCoursesAnalytics = catchAsync(async (req: Request, res: Response) => {
   const result = await generate12MonthData(Course);
   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Fetch courses analitics successfully..`,
      data: result,
   });
});
const getOrdersAnalytics = catchAsync(async (req: Request, res: Response) => {
   const result = await generate12MonthData(Order);
   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Fetch orders analitics successfully..`,
      data: result,
   });
});

export const AnalyticsController = {
   getUserAnalytics,
   getCoursesAnalytics,
   getOrdersAnalytics,
};
