import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Redirect, Link } from "react-router-dom";

import Logo from "../../logo.png";

//Material UI stuff
import { Grid } from "@material-ui/core/";

//Firebase stuff
import fire from "../../firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import "./Post.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMobile,
    faCar,
    faBuilding,
    faPlus,
    faCaretRight,
    faCaretLeft,
    faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import Card from "../../Components/Card/Card";

import cities from "../../allCities";

const styles = {
    form: {
        textAlign: "center",
    },
    pageTitle: {
        margin: "10px auto 10px auto",
        marginBottom: 50,
    },
    textField: {
        margin: "10px auto 10px auto",
    },
    titleTextField: {
        margin: "10px auto 10px auto",
    },
    photoButton: {
        padding: 10,
        width: "85%",
    },
    categoryForm: {
        minWidth: "100%",
    },
    customError: {
        color: "red",
        fontSize: "0.8rem",
        marginTop: 10,
        textAlign: "left",
    },
    photoUploaded: {
        color: "red",
        fontSize: "0.8rem",
        marginTop: 10,
    },
    selectFormError: {
        color: "red",
        fontSize: "0.8rem",
    },
    progress: {
        position: "absolute",
    },
    input: {
        display: "none",
    },
};

class PostProduct extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            step: 1, //used for step by step form submission
            category: "",
            categorySelected: false,
            title: "",
            description: "", //white spaces removed
            price: "",
            product_location: "",
            imageUrl: "",
            posted: false,
            imageLoading: false,
            imageUploaded: false,
            categoryErrorMessage: null,
            titleErrorMessage: null,
            descriptionErrorMessage: null,
            priceErrorMessage: null,
            product_locationInputErrorMessage: null,
            imageInputErrorMessage: null,
            regexp: /^[0-9\b]+$/,
            searchValue: "",
            distVal: "",
            cityVal: "",
        };
    }

    handleSubmit = () => {
        this.setState({ loading: true });
        const { uid, displayName } = fire.auth().currentUser;
        const { category, title, description, price, imageUrl } = this.state;
        if (
            category !== "" &&
            title !== "" &&
            description !== "" &&
            price !== "" &&
            imageUrl !== ""
        ) {
            const newProduct = {
                title: title.trim(),
                description: description.trim(),
                category: category,
                price: price,
                imageUrl: imageUrl,
                uid: uid,
                userName: displayName,
                product_location: this.state.product_location,
                createdAt: new Date().toISOString(),
            };
            fire.firestore()
                .collection("products")
                .add(newProduct)
                .then((data) => {
                    if (data) {
                        this.setState({ posted: true });
                        this.setState({ loading: false });
                    } else {
                        this.setState({ posted: false });
                    }
                });
        }
    };

    //Proceed to the next step
    handleNextStep = () => {
        const {
            step,
            category,
            title,
            price,
            description,
            imageUrl,
        } = this.state;
        switch (step) {
            case 1:
                if (category === "") {
                    this.errorFunc(
                        "Select any category",
                        "categoryErrorMessage"
                    );
                } else {
                    this.setState({ step: step + 1 });
                }
                break;
            case 2:
                if (title === "") {
                    this.errorFunc("Must not be empty", "titleErrorMessage");
                } else {
                    this.setState({ step: step + 1 });
                }
                break;
            case 3:
                if (description === "") {
                    this.errorFunc(
                        "Must not be empty",
                        "descriptionErrorMessage"
                    );
                } else {
                    this.setState({ step: step + 1 });
                }
                break;
            case 4:
                if (price === "") {
                    this.errorFunc("Must not be empty", "priceErrorMessage");
                } else {
                    // const priceInt = parseInt(this.state.price, 10)
                    this.setState({ step: step + 1 });
                }
                break;
            case 5:
                if (this.state.product_location === "") {
                    this.errorFunc(
                        "Please add location",
                        "product_locationInputErrorMessage"
                    );
                } else {
                    this.setState({ step: step + 1 });
                }
                break;
            case 6:
                if (imageUrl === "") {
                    this.errorFunc(
                        "Add Photo of your product",
                        "imageInputErrorMessage"
                    );
                } else {
                    this.setState({ step: step + 1 });
                }
                break;
            default:
                return null;
        }
    };

    //Go back to the previos step
    handlePreStep = () => {
        const { step } = this.state;
        this.setState({ step: step - 1 });
    };

    errorFunc = (err, name) => {
        this.setState({ [name]: err });
        setTimeout(() => {
            this.setState({ [name]: "" });
        }, 3000);
    };

    handlePriceChange = (event) => {
        if (
            event.target.value === "" ||
            this.state.regexp.test(event.target.value)
        ) {
            this.setState({ price: event.target.value });
            console.log(this.state.price);
        }
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleImageChange = (event) => {
        this.setState({ imageLoading: true });
        const image = event.target.files[0];
        const imageExtension = image.name.split(".")[
            image.name.split(".").length - 1
        ];
        const imageFileName = `${Math.round(
            Math.random() * 100000000000
        )}.${imageExtension}`;
        fire.storage()
            .ref(`images/${imageFileName}`)
            .put(image)
            .then(() => {
                fire.storage()
                    .ref("images")
                    .child(imageFileName)
                    .getDownloadURL()
                    .then((url) => {
                        this.setState({ imageUrl: url });
                        this.setState({ imageLoading: false });
                        this.setState({ imageUploaded: true });
                    });
            });
    };

    handleEditPicture = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput.click();
    };

    handlePhoneClick = (event) => {
        this.setState({ category: "mobile" });
    };

    handleCarClick = () => {
        this.setState({ category: "car" });
    };

    handlePropertyClick = () => {
        this.setState({ category: "property" });
    };

    render() {
        const { classes } = this.props;
        const { authenticated } = this.props.location;
        const {
            loading,
            step,
            posted,
            category,
            title,
            description,
            price,
            imageUrl,
            imageLoading,
            imageUploaded,
            categoryErrorMessage,
            titleErrorMessage,
            descriptionErrorMessage,
            priceErrorMessage,
            imageInputErrorMessage,
        } = this.state;

        if (authenticated) {
            if (!posted) {
                switch (step) {
                    case 1:
                        return (
                            <>
                                <Link to="/">
                                    <img
                                        alt="Gofor"
                                        src={Logo}
                                        className="logo-onPost"
                                    />
                                </Link>
                                <div
                                    id="phonecard"
                                    className={
                                        category !== "mobile"
                                            ? "category-card"
                                            : "category-cardselected"
                                    }
                                    onClick={this.handlePhoneClick}
                                >
                                    <FontAwesomeIcon
                                        className={
                                            category !== "mobile"
                                                ? "mobile-category-icon"
                                                : "mobile-category-icon-selected"
                                        }
                                        icon={faMobile}
                                    />
                                    <h1>Phone</h1>
                                </div>
                                <div
                                    id="carcard"
                                    className={
                                        category !== "car"
                                            ? "category-card"
                                            : "category-cardselected"
                                    }
                                    onClick={this.handleCarClick}
                                >
                                    <FontAwesomeIcon
                                        className={
                                            category !== "car"
                                                ? "mobile-category-icon"
                                                : "mobile-category-icon-selected"
                                        }
                                        icon={faCar}
                                    />
                                    <h1>Car</h1>
                                </div>
                                <div
                                    id="propertycard"
                                    className={
                                        category !== "property"
                                            ? "category-card"
                                            : "category-cardselected"
                                    }
                                    onClick={this.handlePropertyClick}
                                >
                                    <FontAwesomeIcon
                                        className={
                                            category !== "property"
                                                ? "mobile-category-icon"
                                                : "mobile-category-icon-selected"
                                        }
                                        icon={faBuilding}
                                    />
                                    <h1>Property</h1>
                                </div>
                                {categoryErrorMessage && (
                                    <div className="post-error-popup">
                                        <FontAwesomeIcon
                                            style={{ marginRight: "10px" }}
                                            icon={faExclamationTriangle}
                                        />
                                        {categoryErrorMessage}
                                    </div>
                                )}
                                <FontAwesomeIcon
                                    onClick={this.handleNextStep}
                                    className="new-single-next-button-icon"
                                    icon={faCaretRight}
                                />
                            </>
                        );
                    case 2:
                        return (
                            <>
                                <img
                                    alt="Gofor"
                                    src={Logo}
                                    className="logo-onPost"
                                />
                                <div className="title-input-div">
                                    <input
                                        id="title"
                                        name="title"
                                        autoComplete="off"
                                        value={title}
                                        spellCheck="false"
                                        className={
                                            title !== ""
                                                ? "title-input-hasValue"
                                                : "title-input"
                                        }
                                        onChange={this.handleChange}
                                    />
                                    <label htmlFor="title">
                                        {title !== ""
                                            ? "Some Hints"
                                            : "Enter title"}
                                    </label>
                                    <p className="title-length">
                                        {title.replace(/ /g, "").length}
                                        /50
                                    </p>
                                </div>
                                {titleErrorMessage && (
                                    <div className="post-error-popup">
                                        <FontAwesomeIcon
                                            style={{ marginRight: "10px" }}
                                            icon={faExclamationTriangle}
                                        />
                                        {titleErrorMessage}
                                    </div>
                                )}
                                <FontAwesomeIcon
                                    onClick={this.handleNextStep}
                                    className="new-next-button-icon"
                                    icon={faCaretRight}
                                />
                                <FontAwesomeIcon
                                    onClick={this.handlePreStep}
                                    className="new-back-button-icon"
                                    icon={faCaretLeft}
                                />
                            </>
                        );
                    case 3:
                        return (
                            <>
                                <img
                                    alt="Gofor"
                                    src={Logo}
                                    className="logo-onPost"
                                />
                                <div className="description-input-div">
                                    <textarea
                                        id="description"
                                        name="description"
                                        onChange={this.handleChange}
                                        spellCheck="false"
                                        className={
                                            description !== ""
                                                ? "description-input-hasValue"
                                                : "description-input"
                                        }
                                    ></textarea>
                                    <label htmlFor="description">
                                        {description !== ""
                                            ? "Some Hints"
                                            : "Enter description"}
                                    </label>
                                    <p className="description-length">
                                        {description.replace(/ /g, "").length}
                                        /100
                                    </p>
                                </div>
                                {descriptionErrorMessage && (
                                    <div className="post-error-popup">
                                        <FontAwesomeIcon
                                            style={{ marginRight: "10px" }}
                                            icon={faExclamationTriangle}
                                        />
                                        {descriptionErrorMessage}
                                    </div>
                                )}
                                <FontAwesomeIcon
                                    onClick={this.handleNextStep}
                                    className="new-next-button-icon"
                                    icon={faCaretRight}
                                />
                                <FontAwesomeIcon
                                    onClick={this.handlePreStep}
                                    className="new-back-button-icon"
                                    icon={faCaretLeft}
                                />
                            </>
                        );
                    case 4:
                        return (
                            <>
                                <img
                                    alt="Gofor"
                                    src={Logo}
                                    className="logo-onPost"
                                />
                                <div className="price-input-div">
                                    <input
                                        id="price"
                                        name="price"
                                        autoComplete="off"
                                        value={price}
                                        spellCheck="false"
                                        className={
                                            price !== ""
                                                ? "price-input-hasValue"
                                                : "price-input"
                                        }
                                        onChange={this.handlePriceChange}
                                    />
                                    <label htmlFor="price">
                                        {price !== ""
                                            ? "Some Hints"
                                            : "Enter price"}
                                    </label>
                                </div>
                                {priceErrorMessage && (
                                    <div className="post-error-popup">
                                        <FontAwesomeIcon
                                            style={{ marginRight: "10px" }}
                                            icon={faExclamationTriangle}
                                        />
                                        {priceErrorMessage}
                                    </div>
                                )}
                                <FontAwesomeIcon
                                    onClick={this.handleNextStep}
                                    className="new-next-button-icon"
                                    icon={faCaretRight}
                                />
                                <FontAwesomeIcon
                                    onClick={this.handlePreStep}
                                    className="new-back-button-icon"
                                    icon={faCaretLeft}
                                />
                            </>
                        );
                    case 5:
                        let filteredCities;
                        if (this.state.distVal !== "") {
                            filteredCities = cities.kerala[
                                this.state.distVal.toLowerCase()
                            ].filter((city) => {
                                return (
                                    city
                                        .toLowerCase()
                                        .indexOf(
                                            this.state.searchValue.toLowerCase()
                                        ) !== -1
                                );
                            });
                        }
                        return (
                            <>
                                <img
                                    alt="Gofor"
                                    src={Logo}
                                    className="logo-onPost"
                                />
                                <div className="main-container-test">
                                    <div className="state-section-test">
                                        <div className="state-select-container-test">
                                            <div
                                                style={
                                                    this.state.distVal ===
                                                    "Alappuzha"
                                                        ? {
                                                              backgroundColor:
                                                                  "rgb(80, 80, 80)",
                                                              color:
                                                                  "rgb(200, 200, 200)",
                                                          }
                                                        : null
                                                }
                                                onClick={() =>
                                                    this.setState({
                                                        distVal: "Alappuzha",
                                                    })
                                                }
                                            >
                                                Alappuzha
                                            </div>
                                            <div
                                                style={
                                                    this.state.distVal ===
                                                    "Ernakulam"
                                                        ? {
                                                              backgroundColor:
                                                                  "rgb(80, 80, 80)",
                                                              color:
                                                                  "rgb(200, 200, 200)",
                                                          }
                                                        : null
                                                }
                                                onClick={() =>
                                                    this.setState({
                                                        distVal: "Ernakulam",
                                                    })
                                                }
                                            >
                                                Ernakulam
                                            </div>
                                            <div
                                                style={
                                                    this.state.distVal ===
                                                    "Idukki"
                                                        ? {
                                                              backgroundColor:
                                                                  "rgb(80, 80, 80)",
                                                              color:
                                                                  "rgb(200, 200, 200)",
                                                          }
                                                        : null
                                                }
                                                onClick={() =>
                                                    this.setState({
                                                        distVal: "Idukki",
                                                    })
                                                }
                                            >
                                                Idukki
                                            </div>
                                            <div
                                                style={
                                                    this.state.distVal ===
                                                    "Kannur"
                                                        ? {
                                                              backgroundColor:
                                                                  "rgb(80, 80, 80)",
                                                              color:
                                                                  "rgb(200, 200, 200)",
                                                          }
                                                        : null
                                                }
                                                onClick={() =>
                                                    this.setState({
                                                        distVal: "Kannur",
                                                    })
                                                }
                                            >
                                                Kannur
                                            </div>
                                            <div
                                                style={
                                                    this.state.distVal ===
                                                    "Kasaragod"
                                                        ? {
                                                              backgroundColor:
                                                                  "rgb(80, 80, 80)",
                                                              color:
                                                                  "rgb(200, 200, 200)",
                                                          }
                                                        : null
                                                }
                                                onClick={() =>
                                                    this.setState({
                                                        distVal: "Kasaragod",
                                                    })
                                                }
                                            >
                                                Kasaragod
                                            </div>
                                            <div
                                                style={
                                                    this.state.distVal ===
                                                    "Kollam"
                                                        ? {
                                                              backgroundColor:
                                                                  "rgb(80, 80, 80)",
                                                              color:
                                                                  "rgb(200, 200, 200)",
                                                          }
                                                        : null
                                                }
                                                onClick={() =>
                                                    this.setState({
                                                        distVal: "Kollam",
                                                    })
                                                }
                                            >
                                                Kollam
                                            </div>
                                            <div
                                                style={
                                                    this.state.distVal ===
                                                    "Kottayam"
                                                        ? {
                                                              backgroundColor:
                                                                  "rgb(80, 80, 80)",
                                                              color:
                                                                  "rgb(200, 200, 200)",
                                                          }
                                                        : null
                                                }
                                                onClick={() =>
                                                    this.setState({
                                                        distVal: "Kottayam",
                                                    })
                                                }
                                            >
                                                Kottayam
                                            </div>
                                            <div
                                                style={
                                                    this.state.distVal ===
                                                    "Kozhikode"
                                                        ? {
                                                              backgroundColor:
                                                                  "rgb(80, 80, 80)",
                                                              color:
                                                                  "rgb(200, 200, 200)",
                                                          }
                                                        : null
                                                }
                                                onClick={() =>
                                                    this.setState({
                                                        distVal: "Kozhikode",
                                                    })
                                                }
                                            >
                                                Kozhikode
                                            </div>
                                            <div
                                                style={
                                                    this.state.distVal ===
                                                    "Malappuram"
                                                        ? {
                                                              backgroundColor:
                                                                  "rgb(80, 80, 80)",
                                                              color:
                                                                  "rgb(200, 200, 200)",
                                                          }
                                                        : null
                                                }
                                                onClick={() =>
                                                    this.setState({
                                                        distVal: "Malappuram",
                                                    })
                                                }
                                            >
                                                Malappuram
                                            </div>
                                            <div
                                                style={
                                                    this.state.distVal ===
                                                    "Palakkad"
                                                        ? {
                                                              backgroundColor:
                                                                  "rgb(80, 80, 80)",
                                                              color:
                                                                  "rgb(200, 200, 200)",
                                                          }
                                                        : null
                                                }
                                                onClick={() =>
                                                    this.setState({
                                                        distVal: "Palakkad",
                                                    })
                                                }
                                            >
                                                Palakkad
                                            </div>
                                            <div
                                                style={
                                                    this.state.distVal ===
                                                    "Pathanamthitta"
                                                        ? {
                                                              backgroundColor:
                                                                  "rgb(80, 80, 80)",
                                                              color:
                                                                  "rgb(200, 200, 200)",
                                                          }
                                                        : null
                                                }
                                                onClick={() =>
                                                    this.setState({
                                                        distVal:
                                                            "Pathanamthitta",
                                                    })
                                                }
                                            >
                                                Pathanamthitta
                                            </div>
                                            <div
                                                style={
                                                    this.state.distVal ===
                                                    "Thiruvananthapuram"
                                                        ? {
                                                              backgroundColor:
                                                                  "rgb(80, 80, 80)",
                                                              color:
                                                                  "rgb(200, 200, 200)",
                                                          }
                                                        : null
                                                }
                                                onClick={() =>
                                                    this.setState({
                                                        distVal:
                                                            "Thiruvananthapuram",
                                                    })
                                                }
                                            >
                                                Thiruvananthapuram
                                            </div>
                                            <div
                                                style={
                                                    this.state.distVal ===
                                                    "Thrissur"
                                                        ? {
                                                              backgroundColor:
                                                                  "rgb(80, 80, 80)",
                                                              color:
                                                                  "rgb(200, 200, 200)",
                                                          }
                                                        : null
                                                }
                                                onClick={() =>
                                                    this.setState({
                                                        distVal: "Thrissur",
                                                    })
                                                }
                                            >
                                                Thrissur
                                            </div>
                                            <div
                                                style={
                                                    this.state.distVal ===
                                                    "Wayanad"
                                                        ? {
                                                              backgroundColor:
                                                                  "rgb(80, 80, 80)",
                                                              color:
                                                                  "rgb(200, 200, 200)",
                                                          }
                                                        : null
                                                }
                                                onClick={() =>
                                                    this.setState({
                                                        distVal: "Wayanad",
                                                    })
                                                }
                                            >
                                                Wayanad
                                            </div>
                                        </div>
                                    </div>

                                    <div className="city-section-test">
                                        <div className="search-input-form-test">
                                            <input
                                                onClick={() =>
                                                    console.log(
                                                        this.state
                                                            .product_location
                                                    )
                                                }
                                                placeholder="Search location"
                                                className="search-input-form-input-test"
                                                onChange={(event) =>
                                                    this.setState({
                                                        searchValue:
                                                            event.target.value,
                                                    })
                                                }
                                                id="search-id-test"
                                            />
                                        </div>
                                        <div className="search-results-div-test">
                                            {this.state.distVal !== "" ? (
                                                filteredCities.length !== 0 ? (
                                                    filteredCities.map(
                                                        (data) => (
                                                            <p
                                                                style={
                                                                    this.state
                                                                        .cityVal ===
                                                                    data
                                                                        ? {
                                                                              backgroundColor:
                                                                                  "rgb(80, 80, 80)",
                                                                              color:
                                                                                  "rgb(200, 200, 200)",
                                                                          }
                                                                        : null
                                                                }
                                                                onClick={() =>
                                                                    this.setState(
                                                                        {
                                                                            cityVal: data,
                                                                            product_location: `${data}, ${this.state.distVal}`,
                                                                        }
                                                                    )
                                                                }
                                                                className="search-results-content-test"
                                                            >
                                                                {data}
                                                            </p>
                                                        )
                                                    )
                                                ) : (
                                                    <p className="hint">
                                                        No search results
                                                    </p>
                                                )
                                            ) : (
                                                <div className="hint">
                                                    <p>Select any</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {this.state
                                    .product_locationInputErrorMessage && (
                                    <div className="post-error-popup">
                                        <FontAwesomeIcon
                                            style={{ marginRight: "10px" }}
                                            icon={faExclamationTriangle}
                                        />
                                        {
                                            this.state
                                                .product_locationInputErrorMessage
                                        }
                                    </div>
                                )}
                                <FontAwesomeIcon
                                    onClick={this.handleNextStep}
                                    className="new-next-button-icon"
                                    icon={faCaretRight}
                                />
                                <FontAwesomeIcon
                                    onClick={this.handlePreStep}
                                    className="new-back-button-icon"
                                    icon={faCaretLeft}
                                />
                            </>
                        );
                    case 6:
                        return (
                            <>
                                <img
                                    alt="Gofor"
                                    src={Logo}
                                    className="logo-onPost"
                                />
                                <input
                                    accept="image/*"
                                    onChange={this.handleImageChange}
                                    className={classes.input}
                                    id="imageInput"
                                    type="file"
                                />
                                <Grid
                                    container
                                    spacing={3}
                                    style={{ padding: 24 }}
                                >
                                    <Grid item xs={12} sm={6} lg={4} xl={3}>
                                        <div
                                            onClick={this.handleEditPicture}
                                            className="plus-card"
                                        >
                                            {imageUploaded ? (
                                                <img
                                                    alt="Product"
                                                    className="image-in-plus"
                                                    src={imageUrl}
                                                />
                                            ) : imageLoading ? (
                                                <div className="loading-animation-imageUpload"></div>
                                            ) : (
                                                <FontAwesomeIcon
                                                    className="plus-button"
                                                    icon={faPlus}
                                                />
                                            )}
                                        </div>
                                    </Grid>
                                </Grid>
                                {imageInputErrorMessage && (
                                    <div className="post-error-popup">
                                        <FontAwesomeIcon
                                            style={{ marginRight: "10px" }}
                                            icon={faExclamationTriangle}
                                        />
                                        {imageInputErrorMessage}
                                    </div>
                                )}
                                <FontAwesomeIcon
                                    onClick={this.handleNextStep}
                                    className="new-next-button-icon"
                                    icon={faCaretRight}
                                />
                                <FontAwesomeIcon
                                    onClick={this.handlePreStep}
                                    className="new-back-button-icon"
                                    icon={faCaretLeft}
                                />
                            </>
                        );
                    case 7:
                        return (
                            <>
                                <img
                                    alt="Gofor"
                                    src={Logo}
                                    className="logo-onPost"
                                />
                                <Card imageUrl={imageUrl} price={price} />
                                <div
                                    onClick={this.handleSubmit}
                                    className="confirm-post-button"
                                >
                                    <div className="confirm-post-button-text">
                                        Post
                                    </div>
                                </div>
                                {loading && (
                                    <div className="loading-animation-onPostSubmit"></div>
                                )}
                                <FontAwesomeIcon
                                    onClick={this.handlePreStep}
                                    className="new-back-button-icon"
                                    icon={faCaretLeft}
                                />
                            </>
                        );
                    default:
                        return null;
                }
            } else {
                return <Redirect to="/" />;
            }
        } else {
            return <Redirect to="/login" />;
        }
    }
}

export default withStyles(styles)(PostProduct);
