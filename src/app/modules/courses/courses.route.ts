import { Router } from 'express';
import { USER_ROLE } from '../../../enums/user';
import { auth } from '../../middleware/auth';
import { CourseControler } from './courses.controler';

const router = Router();

router.post('/create', auth(USER_ROLE.ADMIN), CourseControler.createCourse);
router.put('/:id', auth(USER_ROLE.ADMIN), CourseControler.updateCourse);

export const CourseRouter = router;
