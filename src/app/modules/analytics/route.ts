import express from 'express';
import { USER_ROLE } from '../../../enums/user';
import { auth } from '../../middleware/auth';
import { AnalyticsController } from './controller';

const router = express.Router();

router.get(
   '/users',
   auth(USER_ROLE.ADMIN),
   AnalyticsController.getUserAnalytics
);
router.get(
   '/courses',
   auth(USER_ROLE.ADMIN),
   AnalyticsController.getCoursesAnalytics
);
router.get(
   '/orders',
   auth(USER_ROLE.ADMIN),
   AnalyticsController.getOrdersAnalytics
);

export const AnaliticsRoutes = router;
