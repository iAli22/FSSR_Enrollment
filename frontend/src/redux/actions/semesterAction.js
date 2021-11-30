import axios from "axios";
import {
	SEMESTER_LOADING,
	SEMESTER_LOADED,
	SEMESTER_CREATED,
	SEMESTER_UPDATED,
	SEMESTER_DELETED,
	SEMESTER_FAIL
} from "./actionTypes";
import { getErrors, clearErrors } from "./errorsAction";
import { getMessage, clearMessage } from "./messageAction";
import { headerConfig } from "./userAction";

// Load SEMESTER by id
export const LoadSemester =
	(id, keyword = "", page = 1, pageSize = 9) =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: SEMESTER_LOADING
			});

			const config = headerConfig(getState);

			const { data } = await axios.get(
				`/api/semesters/${id}?keyword=${keyword}&page=${page}&pageSize=${pageSize}`,
				config
			);

			dispatch({
				type: SEMESTER_LOADED,
				payload: data
			});

			dispatch(clearErrors());
		} catch (err) {
			dispatch(getErrors(err));
			dispatch({ type: SEMESTER_FAIL });
		}
	};

// Create SEMESTER
export const CreateSemester =
	(semester, yearId = "current") =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: SEMESTER_LOADING
			});

			const config = headerConfig(getState);

			const { data } = await axios.post(
				`/api/acadyears/${yearId}/semesters`,
				semester,
				config
			);

			dispatch({
				type: SEMESTER_CREATED,
				payload: data
			});

			dispatch(clearErrors());
			dispatch(getMessage("Semester created successfully"));
		} catch (err) {
			dispatch(clearMessage());
			dispatch(getErrors(err));
			dispatch({ type: SEMESTER_FAIL });
		}
	};

// Update Semester
export const UpdateSemester = (semester, id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: SEMESTER_LOADING
		});

		const config = headerConfig(getState);

		const { data } = await axios.put(`/api/semesters/${id}`, semester, config);

		dispatch({
			type: SEMESTER_UPDATED,
			payload: data
		});

		dispatch(clearErrors());
		dispatch(getMessage("Semester updated successfully"));
	} catch (err) {
		dispatch(clearMessage());

		dispatch(getErrors(err));
		dispatch({ type: SEMESTER_FAIL });
	}
};

// Delete Semester
export const DeleteSemester = (_id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: SEMESTER_LOADING
		});

		const config = headerConfig(getState);

		await axios.delete(`/api/semesters/${_id}`, config);

		dispatch({
			type: SEMESTER_DELETED,
			payload: _id
		});

		dispatch(clearErrors());
		dispatch(getMessage("Semester deleted successfully"));
	} catch (err) {
		dispatch(clearMessage());
		dispatch(getErrors(err));

		dispatch({ type: SEMESTER_FAIL });
	}
};
