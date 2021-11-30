import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router";
import * as yup from "yup";
import { Layout } from "../../container";
import {
	CreateYear,
	LoadYear,
	UpdateYear
} from "../../redux/actions/yearAction";

// Validation
const yearSchema = yup.object().shape({
	year: yup.string().required()
});
const useStyles = makeStyles((theme) => ({
	form: {
		width: "100%",
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

function AddYears({
	errorMessage,
	CreateYear,
	LoadYear,
	UpdateYear,
	year,
	success
}) {
	const classes = useStyles();
	const history = useHistory();
	const { id } = useParams();
	const {
		handleSubmit,
		setValue,
		formState: { errors },
		control
	} = useForm({
		resolver: yupResolver(yearSchema)
	});

	useEffect(() => {
		if (success) {
			history.push("/years");
		}

		if (id) {
			if (!year._id || year._id !== id) {
				LoadYear(id);
			} else {
				setValue("year", year.year);
			}
		}
	}, [id, success, year, history, LoadYear, setValue]);

	const onSubmitForm = (data) => {
		if (id) {
			UpdateYear(data, id);
		} else {
			CreateYear(data);
		}
	};

	return (
		<Layout>
			<Typography component="h1" variant="h5">
				{id ? "Edit Year" : "Create New Year"}
			</Typography>
			<form
				className={classes.form}
				onSubmit={handleSubmit(onSubmitForm)}
				noValidate
			>
				{errorMessage && (
					<Alert severity="error" className="errorPlace">
						{errorMessage}{" "}
					</Alert>
				)}

				<Controller
					name="year"
					control={control}
					defaultValue=""
					render={({ field: { onChange, value } }) => (
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="year"
							label="Academic Year"
							name="year"
							// {...register("year")}
							value={value}
							onChange={onChange}
						/>
					)}
				/>

				{errors.year && <Alert severity="error">{errors.year.message} </Alert>}

				<Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					className={classes.submit}
				>
					{id ? "Edit " : "Add New"}
				</Button>
			</form>
		</Layout>
	);
}

const mapStateToProps = (state) => ({
	errorMessage: state.errors.message,
	year: state.year.year,
	success: state.year.success
});

export default connect(mapStateToProps, {
	CreateYear,
	LoadYear,
	UpdateYear
})(AddYears);
