import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import fire from "../../firebase";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import "./Signup.css";
import Logo from "../../logo.png";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import CustomLink from "../../CustomLink";

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            name: "",
            loading: false,
            authenticated: false,
            generalErrorMessage: null,
            emptyErrorMessage: null,
        };
    }

    handleGoogleSignIn = () => {
        this.setState({ loading: true });
        const provider = new firebase.auth.GoogleAuthProvider();

        fire.auth()
            .signInWithPopup(provider)
            .then((result) => {
                const userCredentials = {
                    uid: result.user.uid,
                    name: result.user.displayName,
                    email: result.user.email,
                    createdAt: new Date(),
                };
                fire.firestore()
                    .collection("users")
                    .doc(`${result.user.uid}`)
                    .get()
                    .then((doc) => {
                        if (!doc.exists) {
                            fire.firestore()
                                .doc(`users/${result.user.uid}`)
                                .set(userCredentials)
                                .then(() => console.log("success"))
                                .catch((error) => {
                                    console.log(error);
                                });
                        } else {
                            console.log("User already exists");
                        }
                    });
                this.setState({ loading: false });
            });
    };

    handleSubmit = () => {
        this.setState({ loading: true });
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
        };
        let userId;
        fire.auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password)
            .then((data) => {
                return data.user.updateProfile({
                    displayName: newUser.name,
                });
            })
            .then(() => {
                userId = fire.auth().currentUser.uid;
                const userCredentials = {
                    uid: userId,
                    name: newUser.name,
                    email: newUser.email,
                    createdAt: new Date(),
                };
                fire.firestore()
                    .collection("users")
                    .doc(`${userId}`)
                    .set(userCredentials);
            })
            .catch((error) => {
                if (this.state.email === "") {
                    this.setState({
                        emptyErrorMessage: "Email must not be empty",
                    });
                }
                if (this.state.password === "") {
                    this.setState({
                        emptyErrorMessage: "Password must not be empty",
                    });
                }
                if (this.state.name === "") {
                    this.setState({
                        emptyErrorMessage: "Name must not be empty",
                    });
                }
                if (
                    this.state.email !== "" &&
                    this.state.password !== "" &&
                    this.state.name !== ""
                ) {
                    if (error.code === "auth/invalid-email") {
                        this.setState({
                            generalErrorMessage: "Invalid email address",
                        });
                    } else if (error.code === "auth/weak-password") {
                        this.setState({
                            generalErrorMessage:
                                "Your password must have at least 6 characters",
                        });
                    } else {
                        this.setState({ generalErrorMessage: error.code });
                    }
                }
                this.setState({ loading: false });
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

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };
    render() {
        const {
            authenticated,
            loading,
            generalErrorMessage,
            emptyErrorMessage,
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
                    <h1 className="signup-header">Create an account</h1>
                    <div className="signup-name-input-div">
                        <input
                            id="name"
                            name="name"
                            autoComplete="off"
                            value={this.state.name}
                            spellCheck="false"
                            className={
                                this.state.name !== ""
                                    ? "signup-name-input-hasValue"
                                    : "signup-name-input"
                            }
                            onChange={this.handleChange}
                        />
                        <label htmlFor="name">Enter Name</label>
                    </div>
                    <div className="signup-email-input-div">
                        <input
                            id="email"
                            name="email"
                            autoComplete="off"
                            autoCapitalize="off"
                            value={this.state.email}
                            spellCheck="false"
                            className={
                                this.state.email !== ""
                                    ? "signup-email-input-hasValue"
                                    : "signup-email-input"
                            }
                            onChange={this.handleChange}
                        />
                        <label htmlFor="email">Enter Email</label>
                    </div>
                    <div className="signup-password-input-div">
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
                                    ? "signup-password-input-hasValue"
                                    : "signup-password-input"
                            }
                            onChange={this.handleChange}
                        />
                        <label htmlFor="password">Enter Password</label>
                    </div>
                    <div
                        onClick={this.handleSubmit}
                        className="signup-button-container"
                    >
                        <div className="signup-button-text">Signup</div>
                    </div>
                    {loading && <div class="signup-loading-animation"></div>}
                    {generalErrorMessage && (
                        <div className="signup-error-popup">
                            <FontAwesomeIcon
                                style={{ marginRight: "10px" }}
                                icon={faExclamationTriangle}
                            />
                            {generalErrorMessage}
                        </div>
                    )}
                    {emptyErrorMessage && (
                        <div className="signup-error-popup">
                            <FontAwesomeIcon
                                style={{ marginRight: "10px" }}
                                icon={faExclamationTriangle}
                            />
                            {emptyErrorMessage}
                        </div>
                    )}
                    <div
                        style={loading ? { opacity: 0 } : { opacity: 1 }}
                        className="signup-or-seperation"
                    >
                        OR
                    </div>
                    <div
                        style={loading ? { display: "none" } : { opacity: 1 }}
                        onClick={this.handleGoogleSignIn}
                        className="signup-google-button-container"
                    >
                        <div className="signup-google-icon">
                            <FontAwesomeIcon icon={faGoogle} />
                        </div>
                        <div className="signup-google-text">
                            Signup with Google
                        </div>
                    </div>
                    <CustomLink
                        style={loading ? { display: "none" } : { opacity: 1 }}
                        tag="div"
                        to="/login"
                        className="login-link"
                    >
                        Have an account? Login
                    </CustomLink>
                </>
            );
        } else {
            return <Redirect to="/" />;
        }
    }
}

export default Signup;
