import express from 'express';
import {
  updateGrade,
  gradeValidations
} from '../controllers/gradeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:id').put(protect, admin, gradeValidations, updateGrade);

export default router;
