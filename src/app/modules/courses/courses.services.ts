/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { redis } from '../../../shared/redis';
import { User } from '../user/user.model';
import { ICourses, IQuestionData } from './courses.interface';
import { Course } from './courses.model';

const createCourse = async (payload: ICourses): Promise<ICourses | null> => {
   const result = await Course.create(payload);
   return result;
};
const updateCourse = async (
   id: string,
   payload: Partial<ICourses>
): Promise<ICourses | null> => {
   const isExist = await Course.findOne({ _id: id });
   if (!isExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User does not exist');
   }

   const result = await Course.findByIdAndUpdate(
      id,
      {
         $set: payload,
      },
      { new: true }
   );

   return result;
};
const getSingleCourse = async (
   id: string
): Promise<Partial<ICourses | null>> => {
   const isEixtsRedis = await redis.get(id);
   if (isEixtsRedis) {
      const result = await JSON.parse(isEixtsRedis);
      return result;
   }

   const result = await Course.findOne({ _id: id }).select(
      '-courseData.videoUrl -courseData.suggestions -courseData.question -courseData.links '
   );
   await redis.set(id, JSON.stringify(result));
   return result;
};
const getAllCourse = async (): Promise<Partial<ICourses[] | null>> => {
   const isEixtsRedis = await redis.get('allCourses');
   if (isEixtsRedis) {
      const result = await JSON.parse(isEixtsRedis);
      return result;
   }

   const result = await Course.find().select(
      '-courseData.videoUrl -courseData.suggestions -courseData.question -courseData.links '
   );
   await redis.set('allCourses', JSON.stringify(result));
   return result;
};
const getCourseContent = async (
   courseId: string,
   email: string
): Promise<any> => {
   const user = await User.findOne({ email });
   const courseExist = user?.courses?.find(c => c?.courseId == courseId);
   if (!courseExist) {
      throw new ApiError(
         StatusCodes.FORBIDDEN,
         'You are not eligible for this course.'
      );
   }

   const course = await Course.findById(courseId);
   return course?.courseData;
};

const addQuestion = async (
   payload: IQuestionData,
   email: string
): Promise<any> => {
   //
   if (!payload.contentId || !payload.courseId || !payload.question)
      throw new ApiError(
         StatusCodes.BAD_REQUEST,
         'Please provide content id , course id and questions.'
      );
   const user = await User.findOne(
      { email },
      { name: 1, avatar: 1, email: 1, role: 1 }
   );
   const course = await Course.findById({ _id: payload.courseId });

   const courseContent = course?.courseData?.find(
      c => c._id == payload.contentId
   );

   if (!mongoose.Types.ObjectId.isValid(payload.contentId || payload.courseId))
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Id is invalid.');

   if (!courseContent)
      throw new ApiError(
         StatusCodes.NOT_FOUND,
         'This content is not available.'
      );

   const newQuestion: any = {
      user,
      question: payload.question,
      commentReplies: [],
   };

   courseContent.questions.push(newQuestion);

   const result = await course?.save();

   return result;
};

export const CourseServices = {
   createCourse,
   updateCourse,
   getSingleCourse,
   getAllCourse,
   getCourseContent,
   addQuestion,
};
