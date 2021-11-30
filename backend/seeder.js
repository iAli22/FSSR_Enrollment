import dotenv from "dotenv";
import colors from "colors";

import subjects from "./data/subjects.js";
import departs from "./data/departs.js";
import users from "./data/users.js";
import students from "./data/students.js";
import { year, semesters } from "./data/years.js";

import Subject from "./models/subjectModel.js";
import Department from "./models/departmentModel.js";
import User from "./models/userModel.js";
import Student from "./models/studentModel.js";
import AcadYear from "./models/acadYearModel.js";
import Semester from "./models/semesterModel.js";
import Course from "./models/courseModel.js";
import Grade from "./models/gradeModel.js";
import Enrolment from "./models/enrolModel.js";

import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Subject.deleteMany();
    await Department.deleteMany();
    await User.deleteMany();
    await Student.deleteMany();
    await AcadYear.deleteMany();
    await Semester.deleteMany();

    // Insert subjects
    const subjects1 = subjects.filter((s) => s.prerequisite === null);
    let subjects2 = subjects.filter((s) => s.prerequisite !== null);
    const insertedSubs1 = await Subject.insertMany(subjects1);
    subjects2 = subjects2.map((s) => {
      return {
        ...s,
        prerequisite: insertedSubs1.find((is) => is.code === s.prerequisite)._id
      };
    });
    const insertedSubs2 = await Subject.insertMany(subjects2);
    const insertedSubs = insertedSubs1.concat(insertedSubs2);

    // Insert departments
    departs[0].subjects = departs[0].subjects.map((s) => {
      return {
        ...s,
        subject: insertedSubs.find((is) => is.code === s.code)._id
      };
    });
    const insertedDeparts = await Department.insertMany(departs);

    // Insert Students
    const insertedUsers = await User.insertMany(users);
    const sampleStudents = students.map((s, i) => {
      return {
        ...s,
        user: insertedUsers[i + 1],
        major: insertedDeparts.find((d) => d.name === s.major)._id
      };
    });
    await Student.insertMany(sampleStudents);

    // Insert years and semesters
    let insertedYear = new AcadYear(year);
    insertedYear = await insertedYear.save();

    const sems = semesters.map((s) => {
      return { ...s, acadYear: insertedYear._id };
    });

    const insertedSems = await Semester.insertMany(sems);
    const insertedSemsIds = insertedSems.map((s) => s._id);

    insertedYear.semesters = insertedSemsIds;
    await insertedYear.save();

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroytData = async () => {
  try {
    await Subject.deleteMany();
    await Department.deleteMany();
    await User.deleteMany();
    await Student.deleteMany();
    await AcadYear.deleteMany();
    await Semester.deleteMany();
    await Course.deleteMany();
    await Grade.deleteMany();
    await Enrolment.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroytData();
} else {
  importData();
}
