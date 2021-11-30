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
	CreateCourse,
	LoadCourse,
	UpdateCourse
} from "../../redux/actions/coursesAction";

// Validation
const coursesSchema = yup.object().shape({
	subjectCode: yup.string().required("Subject Code is required"),
	instructor: yup.string().required("Instructor Name is required")
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

function AddCourses({
	errorMessage,
	CreateCourse,
	LoadCourse,
	UpdateCourse,
	course,
	success
}) {
	const classes = useStyles();
	const history = useHistory();
	const { id } = useParams();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		control
	} = useForm({
		resolver: yupResolver(coursesSchema)
	});

	useEffect(() => {
		if (success) {
			history.push("/courses");
		}

		if (id) {
			if (!course._id || course._id !== id) {
				LoadCourse(id);
			} else {
				setValue("subjectCode", course.subject.code);
				setValue("instructor", course.instructor);
			}
		}
	}, [id, success, course, history, LoadCourse, setValue]);

	const onSubmitForm = (data) => {
		if (id) {
			UpdateCourse(data, id);
		} else {
			CreateCourse(data);
		}
	};

	return (
		<Layout>
			<Typography component="h1" variant="h5">
				{id ? "Edit Course" : "Create New Course"}
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
					name="subjectCode"
					control={control}
					defaultValue=""
					render={({ field: { onChange, value } }) => (
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="subjectCode"
							label="Subject Code"
							name="subjectCode"
							{...register("subjectCode")}
							value={value}
							onChange={onChange}
						/>
					)}
				/>

				{errors.subjectCode && (
					<Alert severity="error">{errors.subjectCode.message} </Alert>
				)}

				<Controller
					name="instructor"
					control={control}
					defaultValue=""
					render={({ field: { onChange, value } }) => (
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="instructor"
							label="Instructor"
							name="instructor"
							{...register("instructor")}
							value={value}
							onChange={onChange}
						/>
					)}
				/>

				{errors.instructor && (
					<Alert severity="error">{errors.instructor.message} </Alert>
				)}

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
	course: state.course.course,
	success: state.course.success
});

export default connect(mapStateToProps, {
	CreateCourse,
	LoadCourse,
	UpdateCourse
})(AddCourses);
