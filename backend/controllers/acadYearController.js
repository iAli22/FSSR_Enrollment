import asyncHandler from "express-async-handler";
import { check, validationResult } from "express-validator";
import AcadYear from "../models/acadYearModel.js";
import Semester from "../models/semesterModel.js";

const yearValidations = [
  check("year", "Year is required.").notEmpty(),
  check("year", "Year format is not correct.").matches(/^\d{4}-\d{4}$/)
];

const semesterValidations = [
  check("name", "Semester should be either first, second, or summer.").isIn([
    "first",
    "second",
    "summer"
  ]),
  check("startDate", "Start Date format is not correct.").isDate(),
  check("endDate", "End Date format is not correct.").isDate(),
  check("endDate").custom((value, { req }) => {
    if (new Date(value) <= new Date(req.body.startDate)) {
      throw new Error("End date must be after start date.");
    }
    return true;
  })
];

// @desc   Create an academic year
// @route  POST /api/acadYears
// @access  Private/Admin
const createAcadYear = asyncHandler(async (req, res) => {
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

  const { year } = req.body;

  const years = year.split("-");
  if (Number(years[1]) !== Number(years[0]) + 1) {
    res.status(400);
    throw new Error("Year format is not correct.");
  }

  const yearExists = await AcadYear.findOne({ year });
  if (yearExists) {
    res.status(400);
    throw new Error("Academic year already exists.");
  } else {
    const acadYear = new AcadYear({ year });
    const createdYear = await acadYear.save();

    res.status(201).json(createdYear);
  }
});

// @desc   Update an academic year
// @route  PUT /api/acadYears/:id
// @access  Private/Admin
const updateAcadYear = asyncHandler(async (req, res) => {
  const acadYear = await AcadYear.findById(req.params.id).populate(
    "semesters",
    "name startDate endDate"
  );
  if (!acadYear) {
    res.status(404);
    throw new Error("Academic year not found.");
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

  const { year } = req.body;

  const years = year.split("-");
  if (Number(years[1]) !== Number(years[0]) + 1) {
    res.status(400);
    throw new Error("Year format is not correct.");
  }

  const yearExists = await AcadYear.findOne({ year });
  if (yearExists && yearExists._id.toString() !== acadYear._id.toString()) {
    res.status(400);
    throw new Error("Academic year already exists.");
  }

  acadYear.year = year;

  const updatedAcadYear = await acadYear.save();
  res.json(updatedAcadYear);
});

// @desc   Get a academic year by id
// @route  GET /api/acadYears/:id
// @access  Private/Admin
const getAcadYearById = asyncHandler(async (req, res) => {
  const acadYear = await AcadYear.findById(req.params.id).populate(
    "semesters",
    "name startDate endDate isEnrollAvail"
  );

  if (acadYear) {
    res.json(acadYear);
  } else {
    res.status(404);
    throw new Error("Academic year not found.");
  }
});

// @desc   Get current year
// @route  GET /api/acadYears/current
// @access  Private/Admin
const getCurAcadYear = asyncHandler(async (req, res) => {
  const acadYear = await AcadYear.findOne()
    .sort({ createdAt: -1 })
    .limit(1)
    .populate("semesters", "name startDate endDate isEnrollAvail");

  res.json(acadYear);
});

// @desc    Get all academic years
// @route   GET /api/acadYears
// @access  Private/Admin
const getAcadYears = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.year
    ? {
        year: {
          $regex: req.query.year,
          $options: "i"
        }
      }
    : {};

  const count = await AcadYear.countDocuments({ ...keyword });

  const acadYears = await AcadYear.find({ ...keyword })
    .sort("-createdAt")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const totalPages = Math.ceil(count / pageSize);

  res.json({ acadYears, page, totalPages });
});

// @desc    Add a semester to department
// @route   POST /api/acadyear/:id/semesters
// @access  Private/Admin
const addSemToYear = asyncHandler(async (req, res) => {
  let acadYear;

  if (req.params.id === "current") {
    acadYear = await AcadYear.findOne()
      .sort({ createdAt: -1 })
      .limit(1)
      .populate("semesters", "name");
  } else {
    acadYear = await AcadYear.findById(req.params.id).populate(
      "semesters name"
    );
  }
  if (!acadYear) {
    res.status(404);
    throw new Error("Academic year not found.");
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
  const { name, startDate, endDate, isEnrollAvail } = req.body;

  const semExists = acadYear.semesters.find((s) => s.name === name);
  if (semExists) {
    res.status(400);
    throw new Error("Semester already exists.");
  }

  const semester = new Semester({
    name,
    startDate,
    endDate,
    isEnrollAvail: Boolean(isEnrollAvail),
    acadYear: acadYear._id
  });
  const createdSem = await semester.save();

  acadYear.semesters.push(createdSem);
  await acadYear.save();

  res.json(createdSem);
});

export {
  yearValidations,
  createAcadYear,
  updateAcadYear,
  getAcadYearById,
  getCurAcadYear,
  getAcadYears,
  addSemToYear,
  semesterValidations
};
