import { Breadcrumbs, Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Layout } from "../../container";
import Pagination from "@material-ui/lab/Pagination";
import style from "./Semesters.module.css";

import {
  DeleteSemester,
  LoadSemester
} from "../../redux/actions/semesterAction";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275
  },
  inputContainer: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 250
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
}));

function SemesterCourses({
  semesterState,
  isLoading,
  LoadSemester,
  DeleteSemester
}) {
  const classes = useStyles();
  const { id } = useParams();
  const { semester, page, totalPages } = semesterState;

  // const confirmDeleteSemester = (id) => {
  //   window.confirm("Are You Sure?") && DeleteSemester(id);
  // };

  useEffect(() => {
    LoadSemester(id);
  }, [LoadSemester, id]);

  const onPageChange = (e, v) => {
    e.preventDefault();
    LoadSemester("current", "", v);
  };

  return (
    <Layout>
      {!isLoading && (
        <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: "10px" }}>
          <Link color="inherit" to={`/years`}>
            {semester.acadYear.year}
          </Link>

          <Link
            color="inherit"
            to={`/years/${semester.acadYear._id}/semesters`}
          >
            {semester.name}
          </Link>

          <Typography color="textPrimary">Courses</Typography>
        </Breadcrumbs>
      )}

      <Grid container className={classes.root} spacing={2}>
        {!isLoading &&
          semester.courses.map((course) => (
            <Grid item md={4} key={course._id}>
              <Card className={classes.root}>
                <CardContent>
                  <Typography variant="h4" component="p" color="textSecondary">
                    {course.subject.code}
                  </Typography>
                  <Typography variant="h5" component="p" color="textSecondary">
                    {course.subject.title}
                  </Typography>
                  <Typography variant="h6" component="p">
                    {course.instructor}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {!isLoading && semester.courses.length > 0 && (
        <div className={style.paginate}>
          <Pagination
            count={totalPages}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            showFirstButton={true}
            shape="rounded"
            color="primary"
            onChange={onPageChange}
          />
        </div>
      )}
      {isLoading && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress disableShrink />
        </div>
      )}
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  semesterState: state.semester.semester,
  isLoading: state.semester.isLoading
});

export default connect(mapStateToProps, { LoadSemester, DeleteSemester })(
  SemesterCourses
);
