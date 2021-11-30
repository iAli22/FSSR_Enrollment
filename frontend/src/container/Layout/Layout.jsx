import AppBar from "@material-ui/core/AppBar";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
// Icons
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import { Alert } from "@material-ui/lab";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.jpeg";
import { LogoutMenu } from "../../components";
//sideBarLinks
import { sideBarLinks } from "../../constants/SideBar";
import style from "./Layout.module.css";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },

  flexSpace: {
    // justifyContent:
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

function Layout({ window, children, user, errors, message }) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // const handleClick = (newState) => () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (errors || message) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [errors, message]);

  const drawer = (
    <div>
      <div className={`${classes.toolbar} ${style.logoContainer}`}>
        <img src={logo} loading="lazy" className={style.logo} alt="logo" />
      </div>
      <Divider />
      <List>
        {user.role && (
          <>
            {sideBarLinks.map((sideLink, index) => (
              <NavLink
                to={sideLink.route}
                key={index}
                className={style.navLinks}
                activeClassName={style.active}
                exact
                style={
                  user.role === "student" && sideLink.isAdmin
                    ? { display: "none" }
                    : null
                }
              >
                <ListItem button>
                  <ListItemIcon>{sideLink.icon}</ListItemIcon>
                  <ListItemText primary={sideLink.text} />
                </ListItem>
              </NavLink>
            ))}
          </>
        )}

        {!user.role && (
          <div style={{ textAlign: "center" }}>
            <CircularProgress disableShrink />
          </div>
        )}
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.flexSpace}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            FSSR Enrollment System
          </Typography>

          <LogoutMenu />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}

        {message && (
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              {message}
            </Alert>
          </Snackbar>
        )}
        {errors && (
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              {errors}
            </Alert>
          </Snackbar>
        )}
      </main>
    </div>
  );
}
Layout.propTypes = {
  window: PropTypes.func,
};
const mapStateToProps = (state) => ({
  user: state.user.user,
  errors: state.errors.message,
  message: state.message.message,
});

export default connect(mapStateToProps, {})(Layout);
