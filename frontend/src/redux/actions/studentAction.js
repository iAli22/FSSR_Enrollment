import axios from "axios";
import {
	STUDENT_LOADING,
	STUDENTS_LOADED,
	STUDENT_LOADED,
	STUDENT_CREATED,
	STUDENT_UPDATED,
	STUDENT_DELETED,
	STUDENT_FAIL
} from "./actionTypes";
import { getErrors, clearErrors } from "./errorsAction";
import { headerConfig } from "./userAction";
import { getMessage, clearMessage } from "./messageAction";

// Load students
export const LoadStudents =
	(keyword = "", page = 1, pageSize = 10) =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: STUDENT_LOADING
			});

			const config = headerConfig(getState);

			const { data } = await axios.get(
				`/api/students?keyword=${keyword}&page=${page}&pageSize=${pageSize}`,
				config
			);

			dispatch({
				type: STUDENTS_LOADED,
				payload: data
			});

			dispatch(clearErrors());
		} catch (err) {
			dispatch(getErrors(err));
			dispatch({ type: STUDENT_FAIL });
		}
	};

// Load student by id
export const LoadStudent = (_id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: STUDENT_LOADING
		});

		const config = headerConfig(getState);

		const { data } = await axios.get(`/api/students/${_id}`, config);

		dispatch({
			type: STUDENT_LOADED,
			payload: data
		});

		dispatch(clearErrors());
	} catch (err) {
		dispatch(getErrors(err));
		dispatch({ type: STUDENT_FAIL });
	}
};

// Create student
export const CreateStudent = (student) => async (dispatch, getState) => {
	try {
		dispatch({
			type: STUDENT_LOADING
		});

		const config = headerConfig(getState);

		const { data } = await axios.post("/api/students", student, config);

		dispatch({
			type: STUDENT_CREATED,
			payload: data
		});

		dispatch(clearErrors());
		dispatch(getMessage("Student Created successfully"));
	} catch (err) {
		dispatch(clearMessage());

		dispatch(getErrors(err));
		dispatch({ type: STUDENT_FAIL });
	}
};

// Update student
export const UpdateStudent = (student, id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: STUDENT_LOADING
		});

		const config = headerConfig(getState);

		const { data } = await axios.put(`/api/students/${id}`, student, config);

		dispatch({
			type: STUDENT_UPDATED,
			payload: data
		});
		dispatch(getMessage("Student Updated successfully"));
		dispatch(clearErrors());
	} catch (err) {
		dispatch(clearMessage());
		dispatch(getErrors(err));
		dispatch({ type: STUDENT_FAIL });
	}
};

// Delete student
export const DeleteStudent = (_id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: STUDENT_LOADING
		});

		const config = headerConfig(getState);

		await axios.delete(`/api/students/${_id}`, config);

		dispatch({
			type: STUDENT_DELETED,
			payload: _id
		});
		dispatch(getMessage("Student Deleted successfully"));

		dispatch(clearErrors());
	} catch (err) {
		dispatch(clearMessage());

		dispatch(getErrors(err));
		dispatch({ type: STUDENT_FAIL });
	}
};
