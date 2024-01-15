import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CourseRouter } from '../modules/courses/courses.route';
import { NotificationRoutes } from '../modules/notification/route';
import { OrderRoutes } from '../modules/order/order.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
   // ... routes
   {
      path: '/user',
      routes: UserRoutes,
   },
   {
      path: '/auth',
      routes: AuthRoutes,
   },
   {
      path: '/course',
      routes: CourseRouter,
   },
   {
      path: '/order',
      routes: OrderRoutes,
   },
   {
      path: '/notification',
      routes: NotificationRoutes,
   },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
