import express from 'express';
import {
  courseValidations,
  getSemById,
  getCurSem,
  updateSem,
  addCourseToSem
} from '../controllers/semesterController.js';
import { semesterValidations } from '../controllers/acadYearController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/current').get(protect, admin, getCurSem);

router
  .route('/:id')
  .get(protect, admin, getSemById)
  .put(protect, admin, semesterValidations, updateSem);

router
  .route('/:id/courses')
  .post(protect, admin, courseValidations, addCourseToSem);

export default router;
