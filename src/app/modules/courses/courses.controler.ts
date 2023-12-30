import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { ICourses } from './courses.interface';
import { CourseServices } from './courses.services';

const createCourse = catchAsync(async (req: Request, res: Response) => {
   const payload = req.body;

   const result = await CourseServices.createCourse(payload);

   sendResponse<ICourses>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Create course succesfully.`,
      data: result,
   });
});
const updateCourse = catchAsync(async (req: Request, res: Response) => {
   const payload = req.body;
   const id = req.params.id;

   const result = await CourseServices.updateCourse(id, payload);

   sendResponse<ICourses>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Update course succesfully.`,
      data: result,
   });
});

export const CourseControler = {
   createCourse,
   updateCourse,
};
