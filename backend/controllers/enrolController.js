import asyncHandler from "express-async-handler";
import { check, validationResult } from "express-validator";
import Student from "../models/studentModel.js";
import Enrolment from "../models/enrolModel.js";
import Semester from "../models/semesterModel.js";
import Department from "../models/departmentModel.js";
import Course from "../models/courseModel.js";
import Grade from "../models/gradeModel.js";

const enrolValidations = [
  check("courses", "You can submit up to 5 courses only.").isArray({
    min: 0,
    max: 5
  })
];

// @desc   Get logged in student active enrolment, or create one if not found
// @route  GET /api/enrolments/my
// @access  Private
const getMyEnrol = asyncHandler(async (req, res) => {
  if (req.user.role !== "student") {
    res.status(403);
    throw new Error("Enrollments are only allowed for students.");
  }

  const userId = req.user._id;
  const student = await Student.findOne({ user: userId });

  // Get all the subjects <= student's level from his departement
  const depart = await Department.findById(student.major);
  const stdLvlSubs = depart.subjects.filter((s) => s.level <= student.level);

  // Get student's passed subjects.
  const stdPassedGrades = await Grade.find({
    student: student._id,
    percent: { $gte: 60 }
  }).populate("course", "subject");
  let stdPassedSubs = [];
  stdPassedGrades.forEach((g) => {
    stdPassedSubs.push(g.course.subject._id.toString());
  });

  // Get student's new & failed subjects
  let stdNewSubs = stdLvlSubs;
  if (stdPassedSubs.length > 0) {
    stdNewSubs = stdLvlSubs.filter(
      (s) => stdPassedSubs.indexOf(s.subject.toString()) < 0
    );
  }
  const stdNewSubsIds = stdNewSubs.map((s) => s.subject);

  // Get current semester's courses
  const currentSem = await Semester.findOne({ isEnrollAvail: true }).populate({
    path: "courses",
    select: "subject instructor",
    populate: { path: "subject", select: "code title credit" }
  });
  if (!currentSem) {
    res.status(403);
    throw new Error("Enrollment is not available.");
  }

  // select the suitable courses for the student
  let suitableCourses = currentSem.courses.filter(
    (c) => stdNewSubsIds.indexOf(c.subject._id) >= 0
  );
  suitableCourses = suitableCourses.map((c) => {
    return {
      _id: c._id,
      code: c.subject.code,
      title: c.subject.title,
      credit: c.subject.credit,
      type: stdNewSubs.find(
        (ns) => ns.subject.toString() === c.subject._id.toString()
      ).type,
      instructor: c.instructor,
      selected: false
    };
  });

  // Get the student enrolment
  let enrol = await Enrolment.findOne({
    student: student._id,
    semester: currentSem._id
  }).populate("courses", "subject");

  if (enrol) {
    const selectedCourses = enrol.courses.map((c) => c._id);
    suitableCourses = suitableCourses.map((c) => {
      return {
        ...c,
        selected: selectedCourses.indexOf(c._id) >= 0
      };
    });
  } else {
    enrol = new Enrolment({
      student: student._id,
      courses: [],
      semester: currentSem._id
    });
    enrol = await enrol.save();
  }

  res.json({
    _id: enrol._id,
    isApproved: enrol.isApproved,
    courses: suitableCourses
  });
});

// @desc   Update logged in student active enrolment
// @route  PUT /api/enrolments/my
// @access  Private
const updateMyEnrol = asyncHandler(async (req, res) => {
  if (req.user.role !== "student") {
    res.status(403);
    throw new Error("Enrollments are only allowed for students.");
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(
      errors
        .array()
        .map((err) => err.msg)
        .join(" ")
    );
  }

  const { courses } = req.body;

  const currentSem = await Semester.findOne({ isEnrollAvail: true });
  if (!currentSem) {
    res.status(403);
    throw new Error("Enrollment is not available.");
  }

  const userId = req.user._id;
  const student = await Student.findOne({ user: userId });

  const enrol = await Enrolment.findOne({
    student: student._id,
    semester: currentSem._id,
    isApproved: false
  });

  if (enrol) {
    enrol.courses = courses;
    const updatedEnrol = await enrol.save();

    res.json(updatedEnrol);
  } else {
    res.status(403);
    throw new Error("Enrollment modification is not allowed.");
  }
});

// @desc   Get current semester enrolments
// @route  GET /api/enrolments/
// @access  Private/Admin
const getEnrols = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          {
            nid: {
              $regex: req.query.keyword
            }
          },
          {
            fullNameEn: {
              $regex: req.query.keyword,
              $options: "i"
            }
          }
        ]
      }
    : {};

  const currentSem = await Semester.findOne({ isEnrollAvail: true });
  if (!currentSem) {
    res.status(403);
    throw new Error("Enrollment is not available.");
  }

  let enrols = await Enrolment.find({
    semester: currentSem._id
  }).populate({
    path: "student",
    select: "fullNameEn fullNameAr nid",
    match: {
      ...keyword
    }
  });

  enrols = enrols.filter((enrol) => enrol.student !== null);
  const totalPages = Math.ceil(enrols.length / pageSize);

  const start = pageSize * (page - 1);
  const end = start + pageSize;
  enrols = enrols.slice(start, end);

  res.json({ enrols, page, totalPages });
});

// @desc   Get an enrolment by id
// @route  GET /api/enrolments/:id
// @access  Private/Admin
const getEnrol = asyncHandler(async (req, res) => {
  const enrol = await Enrolment.findById(req.params.id)
    .populate("student", "fullNameEn fullNameAr nid")
    .populate({
      path: "courses",
      select: "subject instructor",
      populate: { path: "subject", select: "code title" }
    });

  if (enrol) {
    res.json(enrol);
  } else {
    res.status(404);
    throw new Error("Enrollment request not found.");
  }
});

// @desc   Update enrolment
// @route  PUT /api/enrolments/:id
// @access  Private/Admin
const updateEnrol = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(
      errors
        .array()
        .map((err) => err.msg)
        .join(" ")
    );
  }

  const { courses, isApproved } = req.body;

  const enrol = await Enrolment.findById(req.params.id);

  if (enrol) {
    if (courses && courses.length >= 0) enrol.courses = courses;
    if (isApproved) {
      isApproved === true
        ? (enrol.isApproved = true)
        : (enrol.isApproved = false);
    }
    const updatedEnrol = await enrol.save();

    res.json(updatedEnrol);
  } else {
    res.status(403);
    throw new Error("Enrollment requst not found.");
  }
});

// @desc   Delete enrolment
// @route  DELETE /api/enrolments/:id
// @access  Private/Admin
const deleteEnrol = asyncHandler(async (req, res) => {
  const enrol = await Enrolment.findById(req.params.id);

  if (enrol) {
    await enrol.remove();

    res.json("Enrollment was removed.");
  } else {
    res.status(403);
    throw new Error("Enrollment requst not found.");
  }
});

// @desc   Add course to enrolment
// @route  PUT /api/enrolments/:enrolId/courses/:courseId
// @access  Private/Admin
const addCourseToEnrol = asyncHandler(async (req, res) => {
  const enrol = await Enrolment.findById(req.params.enrolId);

  if (!enrol) {
    res.status(403);
    throw new Error("Enrollment requst not found.");
  }

  const course = await Course.findById(req.params.courseId);

  if (!course) {
    res.status(404);
    throw new Error("Course not found.");
  }

  if (enrol.courses.indexOf(course._id.toString()) >= 0) {
    res.status(400);
    throw new Error("Course already added before.");
  }

  const courses = enrol.courses.push(course._id.toString());
  enrol.coureses = courses;
  await enrol.save();

  const updatedEnrol = await Enrolment.findById(enrol._id)
    .populate("student", "fullNameEn fullNameAr nid")
    .populate({
      path: "courses",
      select: "subject instructor",
      populate: { path: "subject", select: "code title" }
    });

  res.json(updatedEnrol);
});

// @desc   Remove course from enrolment
// @route  DELETE /api/enrolments/:id/courses/:id
// @access  Private/Admin
const removeCourseFromEnrol = asyncHandler(async (req, res) => {
  const enrol = await Enrolment.findById(req.params.enrolId);

  if (!enrol) {
    res.status(404);
    throw new Error("Enrollment requst not found.");
  }

  const course = await Course.findById(req.params.courseId);

  if (!course) {
    res.status(404);
    throw new Error("Course not found.");
  }

  const courses = enrol.courses.filter(
    (c) => c.toString() !== course._id.toString()
  );

  enrol.courses = courses;
  await enrol.save();

  const updatedEnrol = await Enrolment.findById(enrol._id)
    .populate("student", "fullNameEn fullNameAr nid")
    .populate({
      path: "courses",
      select: "subject instructor",
      populate: { path: "subject", select: "code title" }
    });

  res.json(updatedEnrol);
});

// @desc   Approve enrolment
// @route  PUT /api/enrolments/:id/approve
// @access  Private/Admin
const approveEnrol = asyncHandler(async (req, res) => {
  const enrol = await Enrolment.findById(req.params.enrolId);

  if (!enrol) {
    res.status(404);
    throw new Error("Enrollment requst not found.");
  }

  const { isApproved } = req.body;

  if (isApproved === true) {
    enrol.isApproved = true;
    await enrol.save();
  } else if (isApproved === false) {
    enrol.isApproved = false;
    await enrol.save();
  }

  const updatedEnrol = await Enrolment.findById(enrol._id)
    .populate("student", "fullNameEn fullNameAr nid")
    .populate({
      path: "courses",
      select: "subject instructor",
      populate: { path: "subject", select: "code title" }
    });

  res.json(updatedEnrol);
});

export {
  enrolValidations,
  getMyEnrol,
  updateMyEnrol,
  getEnrols,
  getEnrol,
  updateEnrol,
  deleteEnrol,
  addCourseToEnrol,
  removeCourseFromEnrol,
  approveEnrol
};
