import express from 'express';
import { USER_ROLE } from '../../../enums/user';
import { auth } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { UserControler } from './user.controler';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
   '/create',
   validateRequest(UserValidation.createUserZodSchema),
   UserControler.createUser
);
router.post('/active-user', UserControler.activeUser);
router.get(
   '/',
   auth(USER_ROLE.ADMIN, USER_ROLE.USER),
   UserControler.getAllUsers
);

export const UserRoutes = router;
