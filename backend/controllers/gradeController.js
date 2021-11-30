import asyncHandler from 'express-async-handler';
import { check, validationResult } from 'express-validator';
import Grade from '../models/gradeModel.js';

const gradeValidations = [
  check('percent', 'Percent should be between 0 and 100.').isFloat({
    min: 0,
    max: 100
  })
];

// @desc   Update a grade by id
// @route  PUT /api/grades/:id
// @access  Private/Admin
const updateGrade = asyncHandler(async (req, res) => {
  const grade = await Grade.findById(req.params.id);

  if (!grade) {
    res.status(404);
    throw new Error('Grade not found.');
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(
      errors
        .array()
        .map((err) => err.msg)
        .join(' ')
    );
  }

  const { percent } = req.body;

  grade.percent = percent;
  const updatedGrade = await grade.save();

  grade.percent = res.json(updatedGrade);
});

export { gradeValidations, updateGrade };
