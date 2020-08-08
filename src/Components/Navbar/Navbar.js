import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../../logo.png";
import fire from "../../firebase";
import "firebase/auth";
import { faUser, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import CustomLink from "../../CustomLink";
import "./Navbar.css";

class Navbar extends Component {
    constructor() {
        super();
        this.state = {
            authenticated: false,
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

    render() {
        const { authenticated } = this.state;
        return (
            <>
                <div className="navigation-bar">
                    <CustomLink
                        tag="img"
                        src={Logo}
                        to="/"
                        className="logo-onBar"
                    />
                    <Link
                        to={{
                            pathname: !authenticated ? "/login" : "/post",
                            authenticated: authenticated,
                        }}
                    >
                        <div className="post-button-onBar">Post</div>
                    </Link>
                    {!authenticated ? (
                        <Link to="/login">
                            <div className="login-button-onBar">Login</div>
                        </Link>
                    ) : (
                        <>
                            <div
                                tabIndex="1"
                                className="user-menu-button-onBar"
                            >
                                <FontAwesomeIcon
                                    className="user-icon-onBar"
                                    icon={faUser}
                                />
                                <FontAwesomeIcon
                                    className="user-menu-dropDown"
                                    icon={faCaretDown}
                                />
                            </div>
                            <div className="menu-list-div">
                                <CustomLink
                                    tag="div"
                                    to="/profile"
                                    className="profile-button-inMenu"
                                >
                                    Profile
                                </CustomLink>
                                <CustomLink
                                    tag="div"
                                    to="/chat"
                                    className="account-button-inMenu"
                                >
                                    Chats
                                </CustomLink>
                                <CustomLink
                                    onClick={this.onLogout}
                                    tag="div"
                                    to="/"
                                    className="logout-button-inMenu"
                                >
                                    Logout
                                </CustomLink>
                            </div>
                        </>
                    )}
                </div>
            </>
        );
    }
}

export default Navbar;
