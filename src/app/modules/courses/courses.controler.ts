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
// get single course with out purchase
const getSingleCourse = catchAsync(async (req: Request, res: Response) => {
   const id = req.params.id;
   const result = await CourseServices.getSingleCourse(id);

   sendResponse<Partial<ICourses>>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Get course succesfully.`,
      data: result,
   });
});
// get all courses with out purchase
const getAllCourses = catchAsync(async (req: Request, res: Response) => {
   const result = await CourseServices.getAllCourse();

   sendResponse<Partial<ICourses[]>>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Get all courses succesfully.`,
      data: result,
   });
});
// get  course with  purchase
const getCourseContent = catchAsync(async (req: Request, res: Response) => {
   const { courseId } = req.params;
   const userEmail = req.user?.email;
   const result = await CourseServices.getCourseContent(courseId, userEmail);

   sendResponse<Partial<ICourses>>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Get all course content succesfully.`,
      data: result,
   });
});
const addQuestion = catchAsync(async (req: Request, res: Response) => {
   const userEmail = req.user?.email;
   const result = await CourseServices.addQuestion(req.body, userEmail);

   sendResponse<ICourses>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Add question succesfully.`,
      data: result,
   });
});
const replyQuestion = catchAsync(async (req: Request, res: Response) => {
   const userEmail = req.user?.email;
   const result = await CourseServices.replyQuestion(req.body, userEmail);

   sendResponse<ICourses | null>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Reply question answer succesfully.`,
      data: result,
   });
});

export const CourseControler = {
   createCourse,
   updateCourse,
   getSingleCourse,
   getAllCourses,
   getCourseContent,
   addQuestion,
   replyQuestion,
};
