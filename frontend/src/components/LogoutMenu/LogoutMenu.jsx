import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { LogoutUser } from "../../redux/actions/userAction";
import style from "./LogoutMenu.module.css";

function LogoutMenu({ user, LogoutUser }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    LogoutUser();
    handleClose();
  };

  return (
    <div>
      {user && (
        <>
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
            className={style.logoutBtn}
          >
            <span>{user.name}</span>
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {user.role !== "admin" && (
              <MenuItem onClick={handleClose}>
                <Link
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                  }}
                  to={`/profile`}
                >
                  My Profile
                </Link>
              </MenuItem>
            )}

            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps, { LogoutUser })(LogoutMenu);
