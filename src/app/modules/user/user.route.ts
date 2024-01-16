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
   '/:email',
   auth(USER_ROLE.ADMIN, USER_ROLE.USER),
   UserControler.getUserInfo
);
router.get('/', auth(USER_ROLE.ADMIN), UserControler.getAllUsers);
router.put(
   '/update-user/:email',
   auth(USER_ROLE.ADMIN, USER_ROLE.USER),
   UserControler.updateUser
);
router.put(
   '/update-avatar/:email',
   // FileUploadHelper.upload.single('file'),
   auth(USER_ROLE.ADMIN, USER_ROLE.USER),
   UserControler.updateAvatar
);

export const UserRoutes = router;
