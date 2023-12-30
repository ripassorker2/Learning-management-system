import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CourseRouter } from '../modules/courses/courses.route';
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
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
