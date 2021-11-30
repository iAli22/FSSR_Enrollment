import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Grid,
  IconButton,
  Typography
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  LoadAdminEnrollments,
  ApproveEnrollment
} from "../../redux/actions/enrollmentsActions";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275
  },
  inputContainer: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 250,
    marginBottom: "10px"
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
  },
  CardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "10px"
  },
  paginate: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center"
  }
}));

function AdminEnrollments() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const enrollments = useSelector((state) => state.enrollment.enrollments);
  const { enrols, page, totalPages } = enrollments;
  const isLoading = useSelector((state) => state.enrollment.isLoading);
  const success = useSelector((state) => state.enrollment.success);
  const [search, setSearch] = useState("");
  const [counter, setCounter] = useState(null);

  const getEnrollmentId = (id, data) => {
    dispatch(ApproveEnrollment(id, { isApproved: data }));
  };

  useEffect(() => {
    dispatch(LoadAdminEnrollments());
  }, [dispatch, success]);

  const onEnrollmentsSearch = (e) => {
    setSearch(e.target.value);

    if (counter) {
      clearTimeout(counter);
    }
    setCounter(
      setTimeout(() => {
        dispatch(LoadAdminEnrollments(e.target.value));
      }, 500)
    );
  };

  const onPageChange = (e, v) => {
    e.preventDefault();
    dispatch(LoadAdminEnrollments(search, v));
  };

  return (
    <div>
      <Paper component="form" className={classes.inputContainer}>
        <InputBase
          className={classes.input}
          placeholder="Search Enrollments"
          inputProps={{ "aria-label": "Search Enrollments" }}
          onChange={onEnrollmentsSearch}
        />
        <IconButton
          type="submit"
          className={classes.iconButton}
          aria-label="search"
          onClick={onEnrollmentsSearch}
        >
          <SearchIcon />
        </IconButton>
      </Paper>

      <Grid container className={classes.root} spacing={2}>
        {!isLoading &&
          enrols.map((enrollment, idx) => (
            <Grid item md={4} key={enrollment._id}>
              <Card className={classes.root}>
                <Link
                  to={`/enrollments/show/${enrollment._id}`}
                  style={{
                    color: "rgba(0, 0, 0, 0.87)"
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="p"
                      color="textSecondary"
                    >
                      {enrollment.student.fullNameEn}
                    </Typography>
                    <Typography component="p" color="textSecondary">
                      National ID : {enrollment.student.nid}
                    </Typography>

                    <Typography component="p" color="textSecondary">
                      Number of Courses : {enrollment.courses.length}
                    </Typography>

                    <div className={classes.CardBottom}>
                      <div>Request Status :</div>

                      {enrollment.isApproved ? (
                        <Chip label="Approved" color="primary" />
                      ) : (
                        <Chip label="Not Approved" color="secondary" />
                      )}
                    </div>
                  </CardContent>
                </Link>

                <CardActions>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={enrollment.isApproved}
                        onClick={() =>
                          getEnrollmentId(
                            enrollment._id,
                            !enrollment.isApproved
                          )
                        }
                        color="primary"
                      />
                    }
                    label="Approved"
                  />
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>

      {!isLoading && enrols.length > 0 && (
        <div className={classes.paginate}>
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
    </div>
  );
}

export default AdminEnrollments;
