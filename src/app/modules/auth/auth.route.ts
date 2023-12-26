import express from 'express';
import { USER_ROLE } from '../../../enums/user';
import { auth } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
   '/login',
   validateRequest(AuthValidation.createLoginZodSchema),
   AuthController.loginUser
);
router.get(
   '/logout',
   auth(USER_ROLE.ADMIN, USER_ROLE.USER),
   AuthController.logOut
);
router.post(
   '/refresh-token',
   validateRequest(AuthValidation.createRefreshTokenZodSchema),

   AuthController.refreshToken
);

router.post(
   '/change-password',
   validateRequest(AuthValidation.changePasswordZodSchema),
   auth(USER_ROLE.ADMIN, USER_ROLE.USER),
   AuthController.changePassword
);

export const AuthRoutes = router;
