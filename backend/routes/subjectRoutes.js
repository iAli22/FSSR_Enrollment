import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  subjectValidations,
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} from '../controllers/subjectController.js';

const router = express.Router();

router
  .route('/')
  .get(protect, admin, getSubjects)
  .post(protect, admin, subjectValidations, createSubject);

router
  .route('/:id')
  .get(protect, admin, getSubjectById)
  .put(protect, admin, subjectValidations, updateSubject)
  .delete(protect, admin, deleteSubject);

export default router;
