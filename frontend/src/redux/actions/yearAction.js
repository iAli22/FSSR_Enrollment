import axios from "axios";
import {
	YEAR_LOADING,
	YEARS_LOADED,
	YEAR_LOADED,
	YEAR_CREATED,
	YEAR_UPDATED,
	YEAR_DELETED,
	YEAR_FAIL
} from "./actionTypes";
import { getErrors, clearErrors } from "./errorsAction";
import { headerConfig } from "./userAction";

// Load YEARs
export const LoadYears =
	(year = "", page = 1, pageSize = 9) =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: YEAR_LOADING
			});

			const config = headerConfig(getState);

			const { data } = await axios.get(
				`/api/acadyears?year=${year}&page=${page}&pageSize=${pageSize}`,
				config
			);

			dispatch({
				type: YEARS_LOADED,
				payload: data
			});

			dispatch(clearErrors());
		} catch (err) {
			dispatch(getErrors(err));
			dispatch({ type: YEAR_FAIL });
		}
	};

// Load YEAR by id
export const LoadYear = (_id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: YEAR_LOADING
		});

		const config = headerConfig(getState);

		const { data } = await axios.get(`/api/acadyears/${_id}`, config);

		dispatch({
			type: YEAR_LOADED,
			payload: data
		});

		dispatch(clearErrors());
	} catch (err) {
		dispatch(getErrors(err));
		dispatch({ type: YEAR_FAIL });
	}
};

// Create YEAR
export const CreateYear = (year) => async (dispatch, getState) => {
	try {
		dispatch({
			type: YEAR_LOADING
		});

		const config = headerConfig(getState);

		const { data } = await axios.post("/api/acadyears", year, config);

		dispatch({
			type: YEAR_CREATED,
			payload: data
		});

		dispatch(clearErrors());
	} catch (err) {
		dispatch(getErrors(err));
		dispatch({ type: YEAR_FAIL });
	}
};

// Update Year
export const UpdateYear = (year, id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: YEAR_LOADING
		});

		const config = headerConfig(getState);

		const { data } = await axios.put(`/api/acadyears/${id}`, year, config);

		dispatch({
			type: YEAR_UPDATED,
			payload: data
		});

		dispatch(clearErrors());
	} catch (err) {
		dispatch(getErrors(err));
		dispatch({ type: YEAR_FAIL });
	}
};

// Delete Year
export const DeleteYear = (_id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: YEAR_LOADING
		});

		const config = headerConfig(getState);

		await axios.delete(`/api/acadyears/${_id}`, config);

		dispatch({
			type: YEAR_DELETED,
			payload: _id
		});

		dispatch(clearErrors());
	} catch (err) {
		dispatch(getErrors(err));
		dispatch({ type: YEAR_FAIL });
	}
};
