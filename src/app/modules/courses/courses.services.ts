/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from 'ejs';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import path from 'path';
import ApiError from '../../../errors/ApiError';
import { sendMail } from '../../../helpers/sendMail';
import { redis } from '../../../shared/redis';
import { Notification } from '../notification/model';
import { User } from '../user/user.model';
import {
   ICourses,
   IQuestionData,
   IReplyData,
   IReplyReviewData,
   IReviewData,
} from './courses.interface';
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
   await redis.set(id, JSON.stringify(result), 'EX', 604800);
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
   await redis.set('allCourses', JSON.stringify(result), 'EX', 604800);
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

   await Notification.create({
      userId: user?._id,
      title: 'New question.',
      message: `You have recieved a new question on ${courseContent.title} video.`,
   });

   courseContent.questions.push(newQuestion);
   const result = await course?.save();
   return result;
};
const replyQuestion = async (
   payload: IReplyData,
   email: string
): Promise<any> => {
   //
   if (
      !payload.contentId ||
      !payload.courseId ||
      !payload.answer ||
      !payload.questionId
   )
      throw new ApiError(
         StatusCodes.BAD_REQUEST,
         'Please provide content id , course id, question id and answer.'
      );
   if (
      !mongoose.Types.ObjectId.isValid(
         payload.contentId || payload.courseId || payload.questionId
      )
   )
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Id is invalid.');

   const user = await User.findOne(
      { email },
      { name: 1, avatar: 1, email: 1, role: 1 }
   );
   const course = await Course.findById({ _id: payload.courseId });

   const courseContent = course?.courseData?.find(
      c => c._id == payload.contentId
   );

   if (!courseContent)
      throw new ApiError(
         StatusCodes.NOT_FOUND,
         'This content is not available.'
      );
   const courseQuestion = courseContent?.questions.find(
      q => q._id == payload.questionId
   );

   if (!courseQuestion)
      throw new ApiError(StatusCodes.NOT_FOUND, 'This question is not found.');
   const newReplies: any = {
      user,
      answer: payload.answer,
   };

   courseQuestion?.questionReplies?.push(newReplies);
   const result = await course?.save();

   if (courseQuestion?.user?.email == user?.email) {
      // create notification
      await Notification.create({
         userId: user?._id,
         title: 'New replies.',
         message: `You have a new replies on ${courseContent.title} .`,
      });
   } else {
      const data = {
         name: courseQuestion?.user?.name,
         title: courseContent?.title,
      };
      await ejs.renderFile(
         path.join(__dirname, '../../mail/question.ejs'),
         data
      );

      await sendMail({
         email: courseQuestion?.user?.email,
         subject: 'Reply question answer.',
         template: 'question.ejs',
         data,
      });
   }

   return result;
};

const addReview = async (payload: IReviewData, email: string): Promise<any> => {
   if (!payload.courseId || !payload.rating || !payload.review)
      throw new ApiError(
         StatusCodes.BAD_REQUEST,
         'Please provide course id, review message and rating.'
      );
   const user = await User.findOne({ email });
   const isExistCourseUser = user?.courses?.find(
      crs => crs.courseId == payload.courseId
   );

   if (!isExistCourseUser)
      throw new ApiError(
         StatusCodes.UNAUTHORIZED,
         'You are not authorized to access this course.'
      );
   const course = await Course.findById(payload.courseId);
   const { review, rating } = payload;
   const newReview: any = {
      user: {
         name: user?.name,
         avatar: {
            public_id: user?.avatar?.public_id,
            url: user?.avatar?.url,
         },
         email: user?.email,
         role: user?.role,
      },
      comment: review,
      rating,
   };
   course?.reviews.push(newReview);

   let avg = 0;
   course?.reviews.forEach(rev => {
      avg = avg + rev.rating;
   });

   if (course) {
      course.ratings = avg / course.reviews.length;
   }
   const result = await course?.save();

   //  create notification
   // const notification = {
   //    title: 'New review recieved.',
   //    message: `Hi! ${user?.name} created a review in ${course?.name} course.`,
   // };

   return result;
};
const replyReview = async (
   payload: IReplyReviewData,
   email: string
): Promise<any> => {
   if (!payload.courseId || !payload.comment || !payload.reviewId)
      throw new ApiError(
         StatusCodes.BAD_REQUEST,
         'Please provide course id, review id and message.'
      );

   const user = await User.findOne({ email });
   const course = await Course.findById(payload.courseId);

   if (!course) throw new ApiError(StatusCodes.NOT_FOUND, 'Course not found..');

   const review = course.reviews.find(r => r._id == payload.reviewId);
   if (!review) throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found..');

   const newReviewReply: any = {
      user: {
         name: user?.name,
         avatar: {
            public_id: user?.avatar?.public_id,
            url: user?.avatar?.url,
         },
         email: user?.email,
         role: user?.role,
      },
      comment: payload.comment,
   };
   review.commentReplies?.push(newReviewReply);
   const result = await course?.save();

   return result;
};

const deleteCourse = async (id: string) => {
   const course = await Course.findOne({ _id: id });

   if (!course) throw new ApiError(StatusCodes.BAD_REQUEST, 'Course not found');

   return await Course.findByIdAndDelete(id);
};

export const CourseServices = {
   createCourse,
   updateCourse,
   getSingleCourse,
   getAllCourse,
   getCourseContent,
   addQuestion,
   replyQuestion,
   addReview,
   replyReview,
   deleteCourse,
};
