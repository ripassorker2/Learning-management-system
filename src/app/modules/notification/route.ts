import express from 'express';
import { USER_ROLE } from '../../../enums/user';
import { auth } from '../../middleware/auth';
import { NotificationController } from './controller';

const router = express.Router();

router.get(
   '/',
   auth(USER_ROLE.ADMIN),
   NotificationController.getAllNotification
);
router.put(
   '/:id',
   auth(USER_ROLE.ADMIN),
   NotificationController.updateNotification
);

export const NotificationRoutes = router;
