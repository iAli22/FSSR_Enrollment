import express from 'express';
import {
  yearValidations,
  createAcadYear,
  updateAcadYear,
  getAcadYearById,
  getCurAcadYear,
  getAcadYears,
  semesterValidations,
  addSemToYear
} from '../controllers/acadYearController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, admin, getAcadYears)
  .post(protect, admin, yearValidations, createAcadYear);

router.route('/current').get(protect, admin, getCurAcadYear);

router
  .route('/:id')
  .get(protect, admin, getAcadYearById)
  .put(protect, admin, yearValidations, updateAcadYear);

router
  .route('/:id/semesters')
  .post(protect, admin, semesterValidations, addSemToYear);

export default router;
