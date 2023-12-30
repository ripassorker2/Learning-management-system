import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICourses } from './courses.interface';
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

export const CourseServices = {
   createCourse,
   updateCourse,
};
