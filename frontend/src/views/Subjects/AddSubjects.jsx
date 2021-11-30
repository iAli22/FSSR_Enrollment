import React, { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import { Controller, useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router";
import * as yup from "yup";
import { Layout } from "../../container";
import {
	CreateSubject,
	UpdateSubject,
	LoadSubject
} from "../../redux/actions/subjectAction";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

// Validation
const subjectSchema = yup.object().shape({
	title: yup.string().required(),
	code: yup.string().required(),
	credit: yup.string().required()
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

function AddSubjects({
	errorMessage,
	CreateSubject,
	LoadSubject,
	UpdateSubject,
	subject,
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
		resolver: yupResolver(subjectSchema)
	});

	useEffect(() => {
		if (success) {
			history.push("/subjects");
		}

		if (id) {
			if (!subject._id || subject._id !== id) {
				LoadSubject(id);
			} else {
				setValue("title", subject.title);
				setValue("code", subject.code);
				setValue("credit", subject.credit);
				subject.prerequisite &&
					setValue("prerequisite", subject.prerequisite.code);
			}
		}
	}, [id, success, subject, history, LoadSubject, setValue]);

	const onSubmitForm = (data) => {
		if (id) {
			UpdateSubject(data, id);
		} else {
			CreateSubject(data);
		}
	};

	return (
		<Layout>
			<Typography component="h1" variant="h5">
				{id ? "Edit subject" : "Create New subject"}
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
					name="code"
					control={control}
					defaultValue=""
					render={({ field: { onChange, value } }) => (
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="code"
							label="code"
							value={value}
							onChange={onChange}
						/>
					)}
				/>

				{errors.code && <Alert severity="error">{errors.code?.message} </Alert>}

				<Controller
					name="title"
					control={control}
					defaultValue=""
					render={({ field: { onChange, value } }) => (
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="title"
							label="title"
							value={value}
							onChange={onChange}
						/>
					)}
				/>

				{errors.title && (
					<Alert severity="error">{errors.title?.message} </Alert>
				)}

				<Controller
					name="prerequisite"
					control={control}
					defaultValue=""
					render={({ field: { onChange, value } }) => (
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="prerequisite"
							label="subject prerequisite"
							name="prerequisite"
							value={value}
							onChange={onChange}
						/>
					)}
				/>

				{errors.prerequisite && (
					<Alert severity="error">{errors.prerequisite?.message} </Alert>
				)}

				<FormControl fullWidth style={{ marginBottom: "1rem" }}>
					<InputLabel id="demo-controlled-open-select-label">credit</InputLabel>

					<Controller
						name="credit"
						control={control}
						defaultValue=""
						render={({ field: { onChange, value } }) => (
							<Select
								labelId="demo-simple-select-label"
								id="credit"
								label="credit"
								required
								fullWidth
								name="credit"
								variant="outlined"
								value={value}
								onChange={onChange}
							>
								<MenuItem value={"1"}>1</MenuItem>
								<MenuItem value={"2"}>2</MenuItem>
								<MenuItem value={"3"}>3</MenuItem>
								<MenuItem value={"4"}>4</MenuItem>
							</Select>
						)}
					/>

					{errors.credit && (
						<Alert severity="error">{errors.credit?.message} </Alert>
					)}
				</FormControl>

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
	subject: state.subject.subject,
	success: state.subject.success
});

export default connect(mapStateToProps, {
	CreateSubject,
	LoadSubject,
	UpdateSubject
})(AddSubjects);
