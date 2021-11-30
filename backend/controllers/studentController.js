import asyncHandler from "express-async-handler";
import { check, validationResult } from "express-validator";
import User from "../models/userModel.js";
import Student from "../models/studentModel.js";
import Department from "../models/departmentModel.js";

export const updateStdValidations = [
	check("fullNameEn", "English name is required.").notEmpty(),
	check("fullNameAr", "Arabic name is required.").notEmpty(),
	check("nid", "National id is required.").notEmpty(),
	check("birthday", "Birthday is required.").isDate(),
	check("gender", "gender is required.").notEmpty(),
	check("militaryStatus", "Military Status is required.").notEmpty(),
	check("photo", "Photo is required.").notEmpty(),
	check("degree", "Degree is required.").notEmpty(),
	check("gradYear", "Graduation year is not valid.").isInt({
		min: new Date().getFullYear() - 50,
		max: new Date().getFullYear()
	}),
	check("address", "Address is required.").notEmpty(),
	check("phoneNumber", "Phone number is required.").notEmpty(),
	check("department", "Department is required.").notEmpty(),
	check("level", "Level should be between 1 and 4.").isInt({ min: 1, max: 4 }),
	check("email", "Email address is not valid.").isEmail(),
	check("password", "Password should be 6 or more characters.")
		.isLength({
			min: 6
		})
		.optional({ nullable: true, checkFalsy: true })
];

export const createStdValidations = updateStdValidations.concat([
	check("password", "Password should be 6 or more characters.").isLength({
		min: 6
	})
]);

// @desc   Create student
// @route  POST /api/students
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
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

	const {
		fullNameEn,
		fullNameAr,
		nid,
		birthday,
		gender,
		militaryStatus,
		photo,
		degree,
		gradYear,
		address,
		phoneNumber,
		email,
		department,
		minor,
		password
	} = req.body;

	const studentExists = await Student.findOne({ nid });
	if (studentExists) {
		res.status(400);
		throw new Error("A student with this national id already exists..");
	}

	const emailExists = await User.findOne({ email });
	if (emailExists) {
		res.status(400);
		throw new Error("Email already exists.");
	}

	const majorDepart = await Department.findOne({ name: department });
	if (!majorDepart) {
		res.status(404);
		throw new Error("Department not found.");
	}

	let minDepart;
	if (minor) {
		minDepart = await Department.findOne({ name: minor });
		if (!minDepart) {
			res.status(404);
			throw new Error("Minor not found.");
		}
	}

	const user = new User({
		name: fullNameEn && fullNameEn.split(" ")[0],
		email,
		password,
		role: "student"
	});

	const createdUser = await user.save();

	const student = new Student({
		user: createdUser._id,
		fullNameEn,
		fullNameAr,
		nid,
		birthday,
		gender,
		militaryStatus,
		photo,
		degree,
		gradYear,
		address,
		phoneNumber,
		major: majorDepart._id
	});

	if (minor) {
		student.minor = minDepart._id;
	}

	const createdStudent = await student.save();

	const populatedStudent = await Student.findById(createdStudent._id)
		.populate("major", "name")
		.populate("minor", "name");

	res.status(201).json({ ...populatedStudent.toObject(), email });
});

// @desc   Get the last 10 created students
// @route  GET /api/students
// @access  Private/Admin
const getStudents = asyncHandler(async (req, res) => {
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

	const count = await Student.countDocuments({ ...keyword });

	const students = await Student.find({ ...keyword })
		.sort({ createdAt: -1 })
		.limit(pageSize)
		.skip(pageSize * (page - 1))
		.populate("major", "name")
		.populate("minor", "name");

	const totalPages = Math.ceil(count / pageSize);

	res.json({ students, page, totalPages });
});

// @desc   Get a student by id
// @route  GET /api/students/:id
// @access  Private/Admin
const getStudentById = asyncHandler(async (req, res) => {
	const student = await Student.findById(req.params.id)
		.populate("major", "name")
		.populate("minor", "name");
	const user = await User.findById(student.user).select("email");
	const email = user.toObject().email;

	if (student) {
		res.json({ ...student.toObject(), email });
	} else {
		res.status(404);
		throw new Error("Student not found.");
	}
});

// @desc   Create student
// @route  POST /api/students/:id
// @access  Private/Admin
const updateStudent = asyncHandler(async (req, res) => {
	const student = await Student.findById(req.params.id);
	if (!student) {
		res.status(404);
		throw new Error("Student not found");
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

	const {
		fullNameEn,
		fullNameAr,
		nid,
		birthday,
		gender,
		militaryStatus,
		photo,
		degree,
		gradYear,
		address,
		phoneNumber,
		email,
		department,
		minor,
		level,
		password
	} = req.body;

	const studentExists = await Student.findOne({ nid });
	if (
		studentExists &&
		studentExists._id.toString() !== student._id.toString()
	) {
		res.status(400);
		throw new Error("A student with this national id already exists.");
	}

	const emailExists = await User.findOne({ email });
	if (emailExists && emailExists._id.toString() !== student.user.toString()) {
		res.status(400);
		throw new Error("Email already exists.");
	}

	const majorDepart = await Department.findOne({ name: department });
	if (!majorDepart) {
		res.status(404);
		throw new Error("Department not found.");
	}

	let minDepart;
	if (minor) {
		minDepart = await Department.findOne({ name: minor });
		if (!minDepart) {
			res.status(404);
			throw new Error("Minor not found.");
		}
	}

	const user = await User.findById(student.user);
	user.email = email;
	if (password) user.password = password;
	await user.save();

	student.fullNameEn = fullNameEn;
	student.fullNameAr = fullNameAr;
	student.nid = nid;
	student.birthday = birthday;
	student.gender = gender;
	student.militaryStatus = militaryStatus;
	student.photo = photo;
	student.degree = degree;
	student.gradYear = gradYear;
	student.address = address;
	student.phoneNumber = phoneNumber;
	student.level = level;
	student.major = majorDepart._id;
	if (minor) student.minor = minDepart._id;

	await student.save();

	const updatedStudent = await Student.findById(req.params.id)
		.populate("major", "name")
		.populate("minor", "name");

	res.json({ ...updatedStudent.toObject(), email });
});

// @desc   Delete student
// @route  DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
	const student = await Student.findById(req.params.id);

	if (student) {
		await User.findOneAndRemove({ _id: student.user });
		await student.remove();
		res.json({ message: "Student removed." });
	} else {
		res.status(404);
		throw new Error("Student not found.");
	}
});

export {
	getStudents,
	createStudent,
	getStudentById,
	updateStudent,
	deleteStudent
};
