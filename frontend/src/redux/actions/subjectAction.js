import axios from "axios";
import {
	SUBJECT_LOADING,
	SUBJECTS_LOADED,
	SUBJECT_LOADED,
	SUBJECT_CREATED,
	SUBJECT_UPDATED,
	SUBJECT_DELETED,
	SUBJECT_FAIL
} from "./actionTypes";
import { getErrors, clearErrors } from "./errorsAction";
import { headerConfig } from "./userAction";
import { getMessage, clearMessage } from "./messageAction";

// Load subjects
export const LoadSubjects =
	(keyword = "", page = 1, pageSize = 9) =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: SUBJECT_LOADING
			});

			const config = headerConfig(getState);

			const { data } = await axios.get(
				`/api/subjects?keyword=${keyword}&page=${page}&pageSize=${pageSize}`,
				config
			);

			dispatch({
				type: SUBJECTS_LOADED,
				payload: data
			});

			dispatch(clearErrors());
		} catch (err) {
			dispatch(getErrors(err));
			dispatch({ type: SUBJECT_FAIL });
		}
	};

// Load subject by id
export const LoadSubject = (_id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: SUBJECT_LOADING
		});

		const config = headerConfig(getState);

		const { data } = await axios.get(`/api/subjects/${_id}`, config);

		dispatch({
			type: SUBJECT_LOADED,
			payload: data
		});

		dispatch(clearErrors());
	} catch (err) {
		dispatch(getErrors(err));
		dispatch({ type: SUBJECT_FAIL });
	}
};

// Create subject
export const CreateSubject = (subject) => async (dispatch, getState) => {
	try {
		dispatch({
			type: SUBJECT_LOADING
		});

		const config = headerConfig(getState);

		const { data } = await axios.post("/api/subjects", subject, config);

		dispatch({
			type: SUBJECT_CREATED,
			payload: data
		});

		dispatch(clearErrors());
		dispatch(getMessage("Subject Created successfully"));
	} catch (err) {
		dispatch(clearMessage());

		dispatch(getErrors(err));
		dispatch({ type: SUBJECT_FAIL });
	}
};

// Update subject
export const UpdateSubject = (subject, id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: SUBJECT_LOADING
		});

		const config = headerConfig(getState);

		const { data } = await axios.put(`/api/subjects/${id}`, subject, config);

		dispatch({
			type: SUBJECT_UPDATED,
			payload: data
		});

		dispatch(clearErrors());
		dispatch(getMessage("Subject updated successfully"));
	} catch (err) {
		dispatch(clearMessage());

		dispatch(getErrors(err));
		dispatch({ type: SUBJECT_FAIL });
	}
};

// Delete subject
export const DeleteSubject = (_id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: SUBJECT_LOADING
		});

		const config = headerConfig(getState);

		await axios.delete(`/api/subjects/${_id}`, config);

		dispatch({
			type: SUBJECT_DELETED,
			payload: _id
		});

		dispatch(clearErrors());
		dispatch(getMessage("Subject Deleted successfully"));
	} catch (err) {
		dispatch(clearMessage());

		dispatch(getErrors(err));
		dispatch({ type: SUBJECT_FAIL });
	}
};
