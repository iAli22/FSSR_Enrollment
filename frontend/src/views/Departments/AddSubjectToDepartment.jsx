import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import * as yup from "yup";
import { Layout } from "../../container";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { LoadSubjects } from "../../redux/actions/subjectAction";
import { CreateDepartmentSubject } from "../../redux/actions/departmentAction";

// Validation
const subjectSchema = yup.object().shape({
  code: yup.string().required(),
  level: yup.string().required(),
  type: yup.string().required(),
});
const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function AddSubjectToDepartment() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const success = useSelector((state) => state.department.success);
  const { subjects } = useSelector((state) => state.subject.subjects);
  const errorMessage = useSelector((state) => state.errors.message);

  const dispatch = useDispatch();
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    register,
  } = useForm({
    resolver: yupResolver(subjectSchema),
  });

  useEffect(() => {
    if (success) {
      history.push(`/departments/show/${id}`);
    }

    dispatch(LoadSubjects("", "", 2000));
  }, [id, success, history, LoadSubjects, setValue]);

  const onSubmitForm = (data) => {
    dispatch(CreateDepartmentSubject(id, data));
  };

  return (
    <Layout>
      <Typography component="h1" variant="h5">
        Create New Subject
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

        <Autocomplete
          options={subjects}
          getOptionLabel={(option) => option.code}
          name="code"
          id="code"
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Department code"
              {...register("code")}
            />
          )}
        />

        {errors.code && <Alert severity="error">{errors.code?.message} </Alert>}

        <FormControl fullWidth style={{ marginBottom: "1rem" }}>
          <InputLabel id="demo-controlled-open-select-label">type</InputLabel>

          <Controller
            name="type"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Select
                labelId="demo-simple-select-label"
                id="type"
                label="type"
                required
                fullWidth
                name="type"
                variant="outlined"
                onChange={onChange}
                value={value}
              >
                <MenuItem value={"general"}>General</MenuItem>
                <MenuItem value={"major"}>Major</MenuItem>
                <MenuItem value={"elective"}>Elective</MenuItem>
                <MenuItem value={"minor"}>Minor</MenuItem>
              </Select>
            )}
          />

          {errors.type && (
            <Alert severity="error">{errors.type?.message} </Alert>
          )}
        </FormControl>

        <FormControl fullWidth style={{ marginBottom: "1rem" }}>
          <InputLabel id="demo-controlled-open-select-label">level</InputLabel>

          <Controller
            name="level"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Select
                labelId="demo-simple-select-label"
                id="level"
                label="level"
                required
                fullWidth
                name="level"
                variant="outlined"
                onChange={onChange}
                value={value}
              >
                <MenuItem value={"1"}>1</MenuItem>
                <MenuItem value={"2"}>2</MenuItem>
                <MenuItem value={"3"}>3</MenuItem>
                <MenuItem value={"4"}>4</MenuItem>
              </Select>
            )}
          />

          {errors.level && (
            <Alert severity="error">{errors.level?.message} </Alert>
          )}
        </FormControl>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Add New
        </Button>
      </form>
    </Layout>
  );
}

export default AddSubjectToDepartment;
