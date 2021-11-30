import asyncHandler from 'express-async-handler';
import Semester from '../models/semesterModel.js';
import Department from '../models/departmentModel.js';
import Subject from '../models/subjectModel.js';
import Course from '../models/courseModel.js';
import Enrol from '../models/enrolModel.js';
import Student from '../models/studentModel.js';

// @desc   Get some stats
// @route  GET /api/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
  const departCount = await Department.countDocuments();

  const subjectCount = await Subject.countDocuments();

  const studentCount = await Student.countDocuments();

  const curSem = await Semester.findOne()
    .sort({ createdAt: -1 })
    .limit(1)
    .select('name startDate endDate')
    .populate('acadYear', 'year');

  const courseCount = await Course.countDocuments({
    semester: curSem._id.toString()
  });

  const enroledStdCount = await Enrol.countDocuments({
    semester: curSem._id.toString()
  });

  const stats = {
    departCount,
    subjectCount,
    courseCount,
    studentCount,
    enroledStdCount,
    currentSemester: curSem
  };

  res.json(stats);
});

export { getStats };
