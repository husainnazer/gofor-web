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

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            userName: "",
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
                    userName: result.user.displayName,
                    email: result.user.email,
                    createdAt: new Date().toISOString(),
                    userId: result.user.uid,
                };
                fire.firestore()
                    .collection("users")
                    .doc(`${result.user.displayName}`)
                    .get()
                    .then((doc) => {
                        if (!doc.exists) {
                            fire.firestore()
                                .collection("users")
                                .doc(`${result.user.displayName}`)
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
            email: this.state.email,
            password: this.state.password,
            userName: this.state.userName,
        };
        let userId;
        fire.auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password)
            .then((data) => {
                return data.user.updateProfile({
                    displayName: newUser.userName,
                });
            })
            .then(() => {
                userId = fire.auth().currentUser.uid;
                const userCredentials = {
                    userName: newUser.userName,
                    email: newUser.email,
                    createdAt: new Date().toISOString(),
                    userId: userId,
                };
                fire.firestore()
                    .collection("users")
                    .doc(`${newUser.userName}`)
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
                if (this.state.userName === "") {
                    this.setState({
                        emptyErrorMessage: "Name must not be empty",
                    });
                }
                if (
                    this.state.email !== "" &&
                    this.state.password !== "" &&
                    this.state.userName !== ""
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
                    <div className="signup-userName-input-div">
                        <input
                            id="userName"
                            name="userName"
                            autoComplete="off"
                            value={this.state.userName}
                            spellCheck="false"
                            className={
                                this.state.userName !== ""
                                    ? "signup-userName-input-hasValue"
                                    : "signup-userName-input"
                            }
                            onChange={this.handleChange}
                        />
                        <label htmlFor="userName">Enter Name</label>
                    </div>
                    <div className="signup-email-input-div">
                        <input
                            id="email"
                            name="email"
                            autoComplete="off"
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
                        style={loading ? { opacity: 0 } : { opacity: 1 }}
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
                    <div
                        style={loading ? { opacity: 1 } : { opacity: 0 }}
                        class="signup-loading-animation"
                    ></div>
                    <Link
                        style={loading ? { opacity: 0 } : { opacity: 1 }}
                        className="login-link"
                        to="/login"
                    >
                        {`Have an account? Login`}
                    </Link>
                </>
            );
        } else {
            return <Redirect to="/" />;
        }
    }
}

export default Signup;
