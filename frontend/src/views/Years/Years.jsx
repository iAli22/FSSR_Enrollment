import React, { useEffect, useState } from "react";
import { Layout } from "../../container";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { Button, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import style from "./Years.module.css";
import { connect } from "react-redux";
import { LoadYears, DeleteYear } from "../../redux/actions/yearAction";
import CircularProgress from "@material-ui/core/CircularProgress";
import Pagination from "@material-ui/lab/Pagination";
// import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

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

function Years({ yearsState, DeleteYear, LoadYears, isLoading }) {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [counter, setCounter] = useState(null);
  const { acadYears, page, totalPages } = yearsState;

  // const confirmDeleteYear = (id) => {
  //   window.confirm("Are You Sure?") && DeleteYear(id);
  // };

  useEffect(() => {
    LoadYears();
  }, [LoadYears]);

  const onYearsSearch = (e) => {
    setSearch(e.target.value);

    if (counter) {
      clearTimeout(counter);
    }
    setCounter(
      setTimeout(() => {
        LoadYears(e.target.value);
      }, 500)
    );
  };

  const onPageChange = (e, v) => {
    e.preventDefault();
    LoadYears(search, v);
  };

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px"
        }}
      >
        <Button variant="contained" color="primary">
          <Link type="link" className={style.addBtn} to={"/years/add"}>
            Add Year
          </Link>
        </Button>

        <Paper component="form" className={classes.inputContainer}>
          <InputBase
            className={classes.input}
            placeholder="Search Years"
            inputProps={{ "aria-label": "Search Years" }}
            onChange={onYearsSearch}
          />
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
            onClick={onYearsSearch}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>

      <Grid container className={classes.root} spacing={2}>
        {!isLoading &&
          acadYears.map((year) => (
            <Grid item md={4} key={year._id}>
              <Card className={classes.root}>
                <Link to={`/years/${year._id}/semesters`}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="p"
                      color="textSecondary"
                    >
                      {year.year}
                    </Typography>
                  </CardContent>
                </Link>
                <CardActions>
                  <Button>
                    <Link
                      to={`/years/add/${year._id}`}
                      style={{
                        color: "rgba(0, 0, 0, 0.87)"
                      }}
                    >
                      <EditIcon />
                    </Link>
                  </Button>

                  {/* <Button onClick={() => confirmDeleteYear(year._id)}>
                      <DeleteIcon />
                    </Button> */}
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>

      {!isLoading && acadYears.length > 0 && (
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
  yearsState: state.year.years,
  isLoading: state.year.isLoading
});

export default connect(mapStateToProps, { LoadYears, DeleteYear })(Years);
