import asyncHandler from "express-async-handler";
import { check, validationResult } from "express-validator";
import Subject from "../models/subjectModel.js";
import Depart from "../models/departmentModel.js";

const subjectValidations = [
  check("code", "Code is required.").notEmpty(),
  check("title", "Title name is required.").notEmpty(),
  check("credit", "Credit is required.").notEmpty()
];

// @desc   Create a subject
// @route  POST /api/subjects
// @access  Private/Admin
const createSubject = asyncHandler(async (req, res) => {
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

  const { code, title, credit, prerequisite } = req.body;

  const subjectExists = await Subject.findOne({ code });
  if (subjectExists) {
    res.status(400);
    throw new Error("Subject already exists.");
  }

  let preSubId = null;
  if (prerequisite) {
    const preSub = await Subject.findOne({ code: prerequisite });

    if (!preSub) {
      res.status(404);
      throw new Error("Prerequisite subjct was not found.");
    }

    preSubId = preSub._id;
  }

  const subject = new Subject({ code, title, credit, prerequisite: preSubId });
  const createdSubject = await subject.save();

  const populatedSubject = await Subject.findById(createdSubject._id).populate(
    "prerequisite"
  );

  res.status(201).json(populatedSubject);
});

// @desc   Update a subject
// @route  PUT /api/subjects/Id
// @access  Private/Admin
const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    res.status(404);
    throw new Error("Subject not found.");
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

  const { code, title, credit, prerequisite } = req.body;

  const subjectExists = await Subject.findOne({ code });
  if (
    subjectExists &&
    subjectExists._id.toString() !== subject._id.toString()
  ) {
    res.status(400);
    throw new Error("Subject already exists.");
  }

  let preSubId = null;
  if (prerequisite) {
    const preSub = await Subject.findOne({ code: prerequisite });

    if (!preSub) {
      res.status(404);
      throw new Error("Prerequisite subjct not found.");
    }

    preSubId = preSub._id;
  }

  subject.code = code;
  subject.title = title;
  subject.credit = credit;
  subject.prerequisite = preSubId;

  await subject.save();

  const updatedSubject = await Subject.findById(req.params.id).populate(
    "prerequisite"
  );

  res.json(updatedSubject);
});

// @desc   Delete a subject
// @route  DELETE /api/subjects/:id
// @access  Private/Admin
const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error("Subject not found.");
  }

  const depart = await Depart.findOne({ "subjects.subject": subject._id });

  if (depart) {
    res.status(400);
    throw new Error("Subject can't be deleted. It belongs to a department.");
  }

  await subject.remove();
  res.json({ message: "Subject removed." });
});

// @desc   Get a subject by id
// @route  GET /api/subjects/:id
// @access  Private/Admin
const getSubjectById = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id).populate(
    "prerequisite"
  );

  if (subject) {
    res.json(subject);
  } else {
    res.status(404);
    throw new Error("Subject not found.");
  }
});

// @desc   Get all subjects
// @route  GET /api/subjects
// @access  Private/Admin
const getSubjects = asyncHandler(async (req, res) => {
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

  const count = await Subject.countDocuments({ ...keyword });

  const subjects = await Subject.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const totalPages = Math.ceil(count / pageSize);

  res.json({ subjects, page, totalPages });
});

export {
  subjectValidations,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectById,
  getSubjects
};
