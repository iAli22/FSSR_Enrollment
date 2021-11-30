import asyncHandler from "express-async-handler";
import { check, validationResult } from "express-validator";
import Semester from "../models/semesterModel.js";
import Course from "../models/courseModel.js";
import Subject from "../models/subjectModel.js";

const courseValidations = [
  check("subjectCode", "Subject is required.").notEmpty(),
  check("instructor", "Instructor is required.").notEmpty()
];

// @desc   Get a semester by id
// @route  GET /api/semesters/:id
// @access  Private/Admin
const getSemById = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          {
            code: {
              $regex: req.query.keyword,
              $options: "i"
            }
          },
          {
            title: {
              $regex: req.query.keyword,
              $options: "i"
            }
          }
        ]
      }
    : {};

  const semester = await Semester.findById(req.params.id)
    .sort({ createdAt: -1 })
    .limit(1)
    .populate({
      path: "courses",
      select: "subject instructor",
      populate: {
        path: "subject",
        select: "code title",
        match: {
          ...keyword
        }
      }
    })
    .populate("acadYear", "year");

  if (semester) {
    let courses = semester.courses.filter((c) => c.subject !== null);
    const totalPages = Math.ceil(courses.length / pageSize);

    const start = pageSize * (page - 1);
    const end = start + pageSize;
    courses = courses.slice(start, end);

    semester.courses = courses;

    res.json({ semester, page, totalPages });
  } else {
    res.status(404);
    throw new Error("Semester not found.");
  }
});

// @desc   Get Current semester
// @route  GET /api/semesters/current
// @access  Private/Admin
const getCurSem = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          {
            code: {
              $regex: req.query.keyword,
              $options: "i"
            }
          },
          {
            title: {
              $regex: req.query.keyword,
              $options: "i"
            }
          }
        ]
      }
    : {};

  const semester = await Semester.findOne()
    .sort({ createdAt: -1 })
    .limit(1)
    .populate({
      path: "courses",
      select: "subject instructor",
      populate: {
        path: "subject",
        select: "code title",
        match: {
          ...keyword
        }
      }
    })
    .populate("acadYear", "year");

  let courses = semester.courses.filter((c) => c.subject !== null);
  const totalPages = Math.ceil(courses.length / pageSize);

  const start = pageSize * (page - 1);
  const end = start + pageSize;
  courses = courses.slice(start, end);

  semester.courses = courses;

  res.json({ semester, page, totalPages });
});

// @desc   Update a semester
// @route  PUT /api/semesters/:id
// @access  Private/Admin
const updateSem = asyncHandler(async (req, res) => {
  const semester = await Semester.findById(req.params.id);

  if (!semester) {
    res.status(404);
    throw new Error("Semester not found.");
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

  const { startDate, endDate, isEnrollAvail } = req.body;

  semester.startDate = startDate;
  semester.endDate = endDate;
  if (typeof isEnrollAvail === "boolean")
    semester.isEnrollAvail = isEnrollAvail;

  const updatedSem = await semester.save();
  res.json(updatedSem);
});

// @desc    Add a course to semester
// @route   POST /api/semesters/:id/courses
// @access  Private/Admin
const addCourseToSem = asyncHandler(async (req, res) => {
  let semester;

  if (req.params.id === "current") {
    semester = await Semester.findOne()
      .sort({ createdAt: -1 })
      .limit(1)
      .populate("courses", "subject");
  } else {
    semester = await Semester.findById(req.params.id).populate(
      "courses",
      "subject"
    );
  }

  if (!semester) {
    res.status(404);
    throw new Error("Semester not found.");
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
  const { subjectCode, instructor } = req.body;

  const subject = await Subject.findOne({ code: subjectCode });
  if (!subject) {
    res.status(404);
    throw new Error("Subject not found.");
  }

  const subjectExists = semester.courses.find(
    (c) => c.subject.toString() === subject._id.toString()
  );
  if (subjectExists) {
    res.status(400);
    throw new Error("Subject already added before to this semester.");
  }

  const course = new Course({
    subject: subject._id,
    instructor,
    semester: semester._id
  });
  const createdCourse = await course.save();

  semester.courses.push(createdCourse);
  await semester.save();

  const populatedCourse = await Course.findById(createdCourse._id)
    .populate({ path: "subject", select: "code title" })
    .populate({
      path: "semester",
      select: "name acadYear",
      populate: { path: "acadYear", select: "year" }
    });

  res.json(populatedCourse);
});

export { courseValidations, getSemById, getCurSem, updateSem, addCourseToSem };
