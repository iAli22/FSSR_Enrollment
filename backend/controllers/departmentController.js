import asyncHandler from "express-async-handler";
import { check, validationResult } from "express-validator";
import Department from "../models/departmentModel.js";
import Subject from "../models/subjectModel.js";

const departValidations = [
  check("name", "Department name is required.").notEmpty()
];

const subjectValidations = [
  check("code", "Subject code is required.").notEmpty(),
  check(
    "type",
    "Type should be either general, major, elective, or minor."
  ).isIn(["general", "major", "elective", "minor"]),
  check("level", "Level should be between 1 and 4.").isInt({ min: 1, max: 4 })
];

// @desc   Create a department
// @route  POST /api/departments
// @access  Private/Admin
const createDepart = asyncHandler(async (req, res) => {
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

  const { name } = req.body;

  const departExists = await Department.findOne({ name });
  if (departExists) {
    res.status(400);
    throw new Error("Department already exists.");
  }

  const department = new Department({ name });
  const createdDepart = await department.save();

  res.status(201).json(createdDepart);
});

// @desc   Get a department by id
// @route  GET /api/departments
// @access  Private/Admin
const getDepartById = asyncHandler(async (req, res) => {
  const depart = await Department.findById(req.params.id).populate(
    "subjects.subject",
    "code title"
  );

  if (depart) {
    res.json(depart);
  } else {
    res.status(404);
    throw new Error("Department not found.");
  }
});

// @desc   Update a department
// @route  PUT /api/departments/:id
// @access  Private/Admin
const updateDepart = asyncHandler(async (req, res) => {
  const depart = await Department.findById(req.params.id);
  if (!depart) {
    res.status(404);
    throw new Error("Department not found.");
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

  const { name } = req.body;

  const departExists = await Department.findOne({ name });
  if (departExists && departExists._id.toString() !== depart._id.toString()) {
    res.status(400);
    throw new Error("Department already exists.");
  }

  depart.name = name;
  const updatedDepart = await depart.save();

  res.json(updatedDepart);
});

// @desc   Delete a department
// @route  DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepart = asyncHandler(async (req, res) => {
  const depart = await Department.findById(req.params.id);

  if (depart) {
    await depart.remove();
    res.json({ message: "Department removed." });
  } else {
    res.status(404);
    throw new Error("Department not found.");
  }
});

// @desc   Add a subject to department
// @route  POST /api/departments/:id/subjects
// @access  Private/Admin
const addSubToDepart = asyncHandler(async (req, res) => {
  const depart = await Department.findById(req.params.id);
  if (!depart) {
    res.status(404);
    throw new Error("Department not found.");
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

  const { code, type, level } = req.body;

  const subject = await Subject.findOne({ code });
  if (!subject) {
    res.status(404);
    throw new Error("Subject not found.");
  }

  const subjectExists = depart.subjects.find(
    (s) =>
      s.subject.toString() === subject._id.toString() &&
      !(
        (s.type.toLowerCase() === "major" && type.toLowerCase() === "minor") ||
        (s.type.toLowerCase() === "minor" && type.toLowerCase() === "major")
      )
  );
  if (subjectExists) {
    res.status(400);
    throw new Error("Subject already added before.");
  }

  depart.subjects.push({
    subject: subject._id,
    type,
    level
  });

  await depart.save();
  res.json(subject);
});

// @desc   Remove a subject from department
// @route  DELETE /api/departments/:departId/subjects/:subjectId
// @access  Private/Admin
const removeSubFromDepart = asyncHandler(async (req, res) => {
  const departId = req.params.departId;
  const subjectId = req.params.subjectId;

  const depart = await Department.findById(departId);
  if (!depart) {
    res.status(404);
    throw new Error("Department not found.");
  }

  const updatedSubjects = depart.subjects.filter(
    (s) => s.subject.toString() !== subjectId.toString()
  );
  depart.subjects = updatedSubjects;

  await depart.save();
  res.json({ message: "Subject removed." });
});

// @desc   Get all departments
// @route  GET /api/departments
// @access  Private/Admin
const getDeparts = asyncHandler(async (req, res) => {
  const keyword = req.query.name
    ? {
        name: {
          $regex: req.query.name,
          $options: "i"
        }
      }
    : {};

  const departs = await Department.find({ ...keyword }).select("name");

  res.json(departs);
});

export {
  departValidations,
  subjectValidations,
  createDepart,
  getDepartById,
  updateDepart,
  deleteDepart,
  addSubToDepart,
  removeSubFromDepart,
  getDeparts
};
