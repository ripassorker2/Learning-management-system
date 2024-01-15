import ejs from 'ejs';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import ApiError from '../../../errors/ApiError';
import { sendMail } from '../../../helpers/sendMail';
import { Course } from '../courses/courses.model';
import { Notification } from '../notification/model';
import { User } from '../user/user.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (payload: Partial<IOrder>) => {
   const isUserExist = await User.findOne({ email: payload.userEmail });
   if (!isUserExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User does not exist.');
   }

   const isExistCoursesUser = isUserExist.courses?.find(
      course => course.courseId === payload.courseId
   );

   if (isExistCoursesUser) {
      throw new ApiError(
         StatusCodes.BAD_REQUEST,
         'User already have this course.'
      );
   }

   const course = await Course.findById(payload.courseId);

   if (!course) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Course does not exist.');
   }

   const orderData = {
      userEmail: payload.userEmail,
      courseId: payload.courseId,
      peyment_info: payload.peyment_info,
   };

   await Order.create(orderData);

   const mailData = {
      order: {
         _id: course._id,
         name: course.name,
         price: course.price,
         date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
         }),
         userName: isUserExist.name,
      },
   };

   if (course) course.purchase = Number(course.purchase) + 1;
   await course.save();

   await ejs.renderFile(path.join(__dirname, '../../mail/order.ejs'), {
      order: mailData,
   });

   await sendMail({
      email: isUserExist.email,
      subject: 'Order confirmation mail',
      template: 'order.ejs',
      data: mailData,
   });

   isUserExist.courses?.push(course._id);

   await isUserExist.save();

   await Notification.create({
      userId: isUserExist._id,
      title: 'New order confirm.',
      message: `You have a new order on ${course.name} course`,
   });

   return course;
};

export const OrderServices = {
   createOrder,
};
