import { Router } from 'express';
import { USER_ROLE } from '../../../enums/user';
import { auth } from '../../middleware/auth';
import { CourseControler } from './courses.controler';

const router = Router();

router.put(
   '/add-question',
   auth(USER_ROLE.ADMIN, USER_ROLE.USER),
   CourseControler.addQuestion
);
router.put(
   '/reply-question',
   auth(USER_ROLE.ADMIN, USER_ROLE.USER),
   CourseControler.replyQuestion
);

router.post('/create', auth(USER_ROLE.ADMIN), CourseControler.createCourse);
router.put('/update/:id', auth(USER_ROLE.ADMIN), CourseControler.updateCourse);
router.get('/:id', CourseControler.getSingleCourse);
router.get('/', CourseControler.getAllCourses);
router.get(
   '/get-course-content/:courseId',
   auth(USER_ROLE.ADMIN, USER_ROLE.USER),
   CourseControler.getCourseContent
);

export const CourseRouter = router;
