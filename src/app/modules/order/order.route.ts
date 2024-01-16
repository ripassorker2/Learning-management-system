import express from 'express';
import { USER_ROLE } from '../../../enums/user';
import { auth } from '../../middleware/auth';
import { OrderController } from './order.controller';
const router = express.Router();

router.post('/create', auth(USER_ROLE.USER), OrderController.createOrder);
router.post('/', auth(USER_ROLE.ADMIN), OrderController.getAllOrder);

export const OrderRoutes = router;
