import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import firebase from "firebase/app";
import fire from "../../firebase";
import "firebase/auth";
import "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import "./Login.css";
import Logo from "../../logo.png";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import CustomLink from "../../CustomLink";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            loading: false,
            authenticated: false,
            snackbar: true,
            generalErrorMessage: null,
            emailPasswordErrorMessage: null,
        };
    }

    handlePasswordKeyDown = (event) => {
        if (event.keyCode === 13) {
            this.handleSubmit();
        }
    };

    handleGoogleSignIn = () => {
        this.setState({ loading: true });
        const provider = new firebase.auth.GoogleAuthProvider();

        fire.auth()
            .signInWithPopup(provider)
            .then((result) => {
                const userCredentials = {
                    name: result.user.displayName,
                    email: result.user.email,
                    createdAt: new Date(),
                    uid: result.user.uid,
                };
                fire.firestore()
                    .collection("users")
                    .doc(`${result.user.uid}`)
                    .get()
                    .then((doc) => {
                        if (!doc.exists) {
                            fire.firestore()
                                .collection("users")
                                .doc(`${result.user.uid}`)
                                .set(userCredentials)
                                .then(() => console.log("success"))
                                .catch((error) => {
                                    console.log(error);
                                });
                        }
                    });
                this.setState({ loading: false });
            });
    };

    handleSubmit = () => {
        this.setState({ loading: true });
        const { email, password } = this.state;
        fire.auth()
            .signInWithEmailAndPassword(email, password)
            .catch((error) => {
                if (this.state.email === "") {
                    this.setState({
                        emailPasswordErrorMessage: "Email must not be empty",
                    });
                }
                if (this.state.password === "") {
                    this.setState({
                        emailPasswordErrorMessage: "Password must not be empty",
                    });
                }
                if (this.state.email === "" && this.state.password === "") {
                    this.setState({
                        emailPasswordErrorMessage:
                            "Email and Password must not be empty",
                    });
                }
                if (this.state.email !== "" && this.state.password !== "") {
                    if (error.code === "auth/invalid-email") {
                        this.setState({
                            generalErrorMessage: "Invalid email address",
                        });
                    } else if (error.code === "auth/wrong-password") {
                        this.setState({
                            generalErrorMessage:
                                "You entered the wrong password",
                        });
                    } else {
                        this.setState({
                            generalErrorMessage: "User not registered",
                        });
                    }
                }
                this.setState({ loading: false });
            });
    };

    snackClose = () => {
        this.setState({ snackbar: false });
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

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };
    render() {
        const {
            authenticated,
            generalErrorMessage,
            emailPasswordErrorMessage,
            loading,
        } = this.state;
        if (!authenticated) {
            return (
                <>
                    <Link to="/">
                        <img
                            alt="Gofor"
                            src={Logo}
                            className="logo-universal"
                        />
                    </Link>
                    <h1 className="login-header">Login to your account</h1>
                    <div className="email-input-div">
                        <input
                            id="email"
                            name="email"
                            autoComplete="off"
                            autoCapitalize="off"
                            value={this.state.email}
                            spellCheck="false"
                            className={
                                this.state.email !== ""
                                    ? "email-input-hasValue"
                                    : "email-input"
                            }
                            onChange={this.handleChange}
                        />
                        <label htmlFor="email">Enter email</label>
                    </div>
                    <div className="password-input-div">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="off"
                            value={this.state.password}
                            onKeyDown={this.handlePasswordKeyDown}
                            spellCheck="false"
                            className={
                                this.state.password !== ""
                                    ? "password-input-hasValue"
                                    : "password-input"
                            }
                            onChange={this.handleChange}
                        />
                        <label htmlFor="password">Enter password</label>
                    </div>
                    <div
                        onClick={this.handleSubmit}
                        className="login-button-container"
                    >
                        <div className="login-button-text">Login</div>
                    </div>
                    {loading && <div className="loading-animation"></div>}
                    {generalErrorMessage && (
                        <div className="signin-error-popup">
                            <FontAwesomeIcon
                                style={{ marginRight: "10px" }}
                                icon={faExclamationTriangle}
                            />
                            {generalErrorMessage}
                        </div>
                    )}
                    {emailPasswordErrorMessage && (
                        <div className="signin-error-popup">
                            <FontAwesomeIcon
                                style={{ marginRight: "10px" }}
                                icon={faExclamationTriangle}
                            />
                            {emailPasswordErrorMessage}
                        </div>
                    )}
                    <div
                        style={loading ? { opacity: 0 } : { opacity: 1 }}
                        className="or-seperation"
                    >
                        OR
                    </div>
                    <div
                        style={
                            loading ? { opacity: 0, zIndex: 0 } : { opacity: 1 }
                        }
                        onClick={this.handleGoogleSignIn}
                        className="google-button-container"
                    >
                        <div className="google-icon">
                            <FontAwesomeIcon icon={faGoogle} />
                        </div>
                        <div className="google-text">Signin with Google</div>
                    </div>
                    <CustomLink
                        style={loading ? { opacity: 0 } : { opacity: 1 }}
                        tag="div"
                        to="/signup"
                        className="signup-link"
                    >
                        Don't an account? Signup
                    </CustomLink>
                </>
            );
        } else {
            return <Redirect to="/" />;
        }
    }
}

export default Login;
