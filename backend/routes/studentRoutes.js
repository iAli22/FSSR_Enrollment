import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import {
  updateStdValidations,
  createStdValidations,
  getStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent
} from '../controllers/studentController.js';

const router = express.Router();

router
  .route('/')
  .get(protect, admin, getStudents)
  .post(protect, admin, createStdValidations, createStudent);

router
  .route('/:id')
  .get(protect, admin, getStudentById)
  .put(protect, admin, updateStdValidations, updateStudent)
  .delete(protect, admin, deleteStudent);

export default router;
