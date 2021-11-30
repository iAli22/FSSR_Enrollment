import express from "express";
import {
	enrolValidations,
	getMyEnrol,
	updateMyEnrol,
	getEnrols,
	getEnrol,
	updateEnrol,
	addCourseToEnrol,
	removeCourseFromEnrol,
	approveEnrol,
	deleteEnrol,
} from "../controllers/enrolController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
	.route("/my")
	.get(protect, getMyEnrol)
	.put(protect, enrolValidations, updateMyEnrol);

router.route("/").get(protect, admin, getEnrols);

router
	.route("/:id")
	.get(protect, admin, getEnrol)
	.put(protect, admin, updateEnrol)
	.delete(protect, admin, deleteEnrol);

router.route("/:enrolId/approve").put(protect, admin, approveEnrol);

router
	.route("/:enrolId/courses/:courseId")
	.put(protect, admin, addCourseToEnrol)
	.delete(protect, admin, removeCourseFromEnrol);

export default router;
