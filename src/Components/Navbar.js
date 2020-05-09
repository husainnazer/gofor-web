import React, { Component } from "react";
import { Link } from "react-router-dom";
import onClickOutside from "react-onclickoutside";

import Logo from "../logo.png";

//Material UI stuff
import {
    AppBar,
    Toolbar,
    Button,
    Typography,
    Menu,
    MenuItem,
    InputBase,
    TextField,
} from "@material-ui/core/";
import { Person, ArrowDropDown, Search } from "@material-ui/icons/";
import fire from "../firebase";
import "firebase/auth";
import { withStyles } from "@material-ui/styles";

const styles = {
    search: {},
};

class Navbar extends Component {
    constructor() {
        super();
        this.state = {
            authenticated: false,
            menuOpen: false,
            menuPosition: null,
        };
    }

    onLogout = () => {
        fire.auth()
            .signOut()
            .then(() => {
                window.location.reload();
            });
    };

    componentDidMount() {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ authenticated: true });
            } else {
                this.setState({ authenticated: false });
            }
        });
    }

    handleClickOutside = () => {
        this.setState({ menuOpen: false });
    };

    handleMenuClick = (event) => {
        this.setState({ menuOpen: true });
        this.setState({ menuPosition: event.currentTarget });
    };

    render() {
        const { menuOpen, menuPosition, authenticated } = this.state;
        const { classes } = this.props;
        return (
            <div>
                <AppBar
                    style={{ opacity: 0.95, boxShadow: "none" }}
                    position="fixed"
                    color="inherit"
                >
                    <Toolbar>
                        <Link to="/">
                            <img src={Logo} style={{ height: 40 }} />
                        </Link>
                        <InputBase />
                        <div className="nav-container">
                            {!authenticated ? (
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to={{
                                        pathname: "/login",
                                    }}
                                >
                                    Login
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        onClick={this.handleMenuClick}
                                        color="inherit"
                                    >
                                        <Person />
                                        <ArrowDropDown />
                                    </Button>
                                    <Menu
                                        id="simple-menu"
                                        anchorEl={menuPosition}
                                        keepMounted
                                        open={menuOpen ? true : false}
                                    >
                                        <MenuItem
                                            component={Link}
                                            to="/profile"
                                        >
                                            Profile
                                        </MenuItem>
                                        <MenuItem>My account</MenuItem>
                                        <MenuItem
                                            onClick={this.onLogout}
                                            component={Link}
                                            to="/"
                                        >
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </>
                            )}
                            <Button
                                style={{ marginLeft: 10 }}
                                variant="outlined"
                                color="inherit"
                                component={Link}
                                to={{
                                    pathname: !authenticated
                                        ? "/login"
                                        : "/post",
                                    authenticated: true,
                                }}
                            >
                                Post
                            </Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
        // } else {
        //     return (
        //         <div>
        //             <AppBar
        //                 style={{ opacity: 0.95, boxShadow: "none" }}
        //                 position="fixed"
        //                 color="inherit"
        //             >
        //                 <Toolbar>
        //                     <Link to="/">
        //                         <img src={Logo} style={{ height: 40 }} />
        //                     </Link>
        //                     <div className="nav-container">
        //                         {/* <Button
        //                             onClick={this.handleMenuClick}
        //                             color="inherit"
        //                         >
        //                             <Person />
        //                             <ArrowDropDown />
        //                         </Button>
        //                         <Menu
        //                             id="simple-menu"
        //                             anchorEl={menuPosition}
        //                             keepMounted
        //                             open={menuOpen ? true : false}
        //                         >
        //                             <MenuItem component={Link} to="/profile">
        //                                 Profile
        //                             </MenuItem>
        //                             <MenuItem>My account</MenuItem>
        //                             <MenuItem
        //                                 onClick={this.onLogout}
        //                                 component={Link}
        //                                 to="/"
        //                             >
        //                                 Logout
        //                             </MenuItem>
        //                         </Menu> */}
        //                         <Button
        //                             style={{ marginLeft: 10 }}
        //                             variant="outlined"
        //                             color="inherit"
        //                             component={Link}
        //                             to={{
        //                                 pathname: "/post",
        //                                 authenticated: true,
        //                             }}
        //                         >
        //                             Post
        //                         </Button>
        //                     </div>
        //                 </Toolbar>
        //             </AppBar>
        //         </div>
        //     );
        // }
    }
}

export default withStyles(styles)(onClickOutside(Navbar));
