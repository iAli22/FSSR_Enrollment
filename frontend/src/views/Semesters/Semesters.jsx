import { Button, Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import React, { useEffect } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Layout } from "../../container";
import { DeleteSemester } from "../../redux/actions/semesterAction";
import { LoadYear } from "../../redux/actions/yearAction";
import style from "./Semesters.module.css";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  inputContainer: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 250,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  CardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "10px",
    color: "black",
  },
}));

function Semesters({ year, isLoading, LoadYear, DeleteSemester }) {
  const classes = useStyles();
  // const [search, setSearch] = useState("");

  // const confirmDeleteSemester = (id) => {
  // 	window.confirm("Are You Sure?") && DeleteSemester(id);
  // };

  useEffect(() => {
    LoadYear("current");
  }, [LoadYear]);

  // const onSemestersSearch = (e) => {
  //   e.preventDefault();
  //   setSearch(e.target.value);

  //   // LoadSemesters(search);
  // };

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <Button variant="contained" color="primary">
          <Link type="link" className={style.addBtn} to={`/semesters/add`}>
            Add Semester
          </Link>
        </Button>

        {/* <Paper component="form" className={classes.inputContainer}>
          <InputBase
            className={classes.input}
            placeholder="Search Semesters"
            inputProps={{ "aria-label": "Search Semesters" }}
            onChange={onSemestersSearch}
          />
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
            onClick={onSemestersSearch}
          >
            <SearchIcon />
          </IconButton>
        </Paper> */}
      </div>

      <Grid container className={classes.root} spacing={2}>
        {!isLoading &&
          year.semesters.map((semester) => (
            <Grid item md={4} key={semester._id}>
              <Card className={classes.root}>
                <Link to={`/semesters/${semester._id}/courses`}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="p"
                      color="textSecondary"
                    >
                      {semester.name.toUpperCase()}
                    </Typography>
                    <Typography component="p" color="textSecondary">
                      Start Date{" "}
                      <Moment format="YYYY/MM/DD">{semester.startDate}</Moment>
                      <br />
                      End Date :{" "}
                      <Moment format="YYYY/MM/DD">{semester.endDate}</Moment>
                    </Typography>

                    <div className={classes.CardBottom}>
                      <p>Enrollment Status:</p>

                      {semester.isEnrollAvail ? (
                        <Chip label="Available" color="primary" />
                      ) : (
                        <Chip label="Not Available" color="secondary" />
                      )}
                    </div>
                  </CardContent>
                </Link>

                <CardActions>
                  <Button>
                    <Link
                      to={`/semesters/add/${semester._id}`}
                      style={{
                        color: "rgba(0, 0, 0, 0.87)",
                      }}
                    >
                      <EditIcon />
                    </Link>
                  </Button>

                  {/* <Button onClick={() => confirmDeleteSemester(semester._id)}>
											<DeleteIcon />
										</Button> */}
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>

      {isLoading && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress disableShrink />
        </div>
      )}
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  year: state.year.year,
  isLoading: state.year.isLoading,
});

export default connect(mapStateToProps, { LoadYear, DeleteSemester })(
  Semesters
);
