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
            step: 1, //used for step by step form submission
            category: "",
            categorySelected: false,
            title: "",
            description: "", //white spaces removed
            price: "",
            imageUrl: "",
            posted: false,
            imageLoading: false,
            imageUploaded: false,
            categoryErrorMessage: null,
            titleErrorMessage: null,
            descriptionErrorMessage: null,
            priceErrorMessage: null,
            imageInputErrorMessage: null,
        };
    }

    handleSubmit = () => {
        const { uid, displayName } = fire.auth().currentUser;
        const { category, title, description, price, imageUrl } = this.state;
        if (
            category !== "" &&
            title !== "" &&
            description !== "" &&
            price !== "" &&
            imageUrl !== ""
        ) {
            // const noImgUrl = 'https://firebasestorage.googleapis.com/v0/b/gofor-efc3a.appspot.com/o/no-image.png?alt=media'
            const newProduct = {
                title: title.trim(),
                description: description.trim(),
                category: category,
                userId: uid,
                userHandle: displayName,
                price: price,
                imageUrl: imageUrl,
                //location: this.state.location,
                createdAt: new Date().toISOString(),
            };
            fire.firestore()
                .collection("products")
                .add(newProduct)
                .then((data) => {
                    if (data) {
                        this.setState({ posted: true });
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
                    this.setState({
                        categoryErrorMessage: "Select any category",
                    });
                } else {
                    this.setState({ step: step + 1 });
                }
                break;
            case 2:
                if (title === "") {
                    this.setState({ titleErrorMessage: "Must not be empty" });
                } else {
                    this.setState({ step: step + 1 });
                }
                break;
            case 3:
                if (description === "") {
                    this.setState({
                        descriptionErrorMessage: "Must not be empty",
                    });
                } else {
                    this.setState({ step: step + 1 });
                }
                break;
            case 4:
                if (price === "") {
                    this.setState({ priceErrorMessage: "Must not be empty" });
                } else {
                    this.setState({ step: step + 1 });
                }
                break;
            case 5:
                if (imageUrl === "") {
                    this.setState({
                        imageInputErrorMessage: "Add Photo of your product",
                    });
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
                                <Grid
                                    container
                                    spacing={3}
                                    style={{ padding: 24 }}
                                >
                                    <Grid item xs={12} sm={6} lg={4} xl={3}>
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
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6} lg={4} xl={3}>
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
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6} lg={4} xl={3}>
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
                                        </div>
                                    </Grid>
                                </Grid>
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
                                    className="new-next-button-icon"
                                    icon={faCaretRight}
                                />
                                {/* <div className="Buttons-onAll-div">
                                    <Fab
                                        onClick={this.handleNextStep}
                                        color="primary"
                                        className="nextButton-onAll"
                                    >
                                        <NavigateNextRounded fontSize="large" />
                                    </Fab>
                                </div> */}
                            </>
                        );
                    case 2:
                        return (
                            <>
                                <Link to="/">
                                    <img
                                        alt="Gofor"
                                        src={Logo}
                                        className="logo-onPost"
                                    />
                                </Link>
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
                                            ? "Make it short"
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
                                {/* <div className="Buttons-onAll-div">
                                    <Fab
                                        onClick={this.handlePreStep}
                                        color="primary"
                                        className="backButton-onAll"
                                    >
                                        <ArrowBackIosRounded fontSize="large" />
                                    </Fab>
                                    <Fab
                                        onClick={this.handleNextStep}
                                        color="primary"
                                        className="nextButton-onAll"
                                    >
                                        <NavigateNextRounded fontSize="large" />
                                    </Fab>
                                </div> */}
                            </>
                        );
                    case 3:
                        return (
                            <>
                                {/* <Link to="/">
                                    <img
                                        alt="Gofor"
                                        src={Logo}
                                        className="logo-onPost"
                                    />
                                </Link> */}
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
                                            ? "Make it short"
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
                                {/* <div className="Buttons-onAll-div">
                                    <Fab
                                        onClick={this.handlePreStep}
                                        color="primary"
                                        className="backButton-onAll"
                                    >
                                        <ArrowBackIosRounded fontSize="large" />
                                    </Fab>
                                    <Fab
                                        onClick={this.handleNextStep}
                                        color="primary"
                                        className="nextButton-onAll"
                                    >
                                        <NavigateNextRounded fontSize="large" />
                                    </Fab>
                                </div> */}
                            </>
                        );
                    case 4:
                        return (
                            <>
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
                                        onChange={this.handleChange}
                                    />
                                    <label htmlFor="price">
                                        {price !== ""
                                            ? "Put on a really nice tag"
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
                                {/* <div className="Buttons-onAll-div">
                                    <Fab
                                        onClick={this.handlePreStep}
                                        color="primary"
                                        className="backButton-onAll"
                                    >
                                        <ArrowBackIosRounded fontSize="large" />
                                    </Fab>
                                    <Fab
                                        onClick={this.handleNextStep}
                                        color="primary"
                                        className="nextButton-onAll"
                                    >
                                        <NavigateNextRounded fontSize="large" />
                                    </Fab>
                                </div> */}
                                {/* <TextField
                                    id="price"
                                    name="price"
                                    type="text"
                                    label="Price"
                                    className={classes.textField}
                                    noValidate
                                    autoComplete="off"
                                    variant="outlined"
                                    value={this.state.price}
                                    onChange={this.handleChange}
                                    error={priceErrorMessage ? true : false}
                                    helperText={priceErrorMessage}
                                    fullWidth
                                />
                                <Button
                                    onClick={this.handlePreStep}
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                >
                                    Go back
                                </Button>
                                <Button
                                    onClick={this.handleNextStep}
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                >
                                    Continue
                                </Button> */}
                            </>
                        );
                    case 5:
                        return (
                            <>
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
                                {/* <div style={{ marginTop: "10px" }}>
                                    <Button
                                        onClick={this.handleEditPicture}
                                        color="primary"
                                        variant="contained"
                                        className={classes.photoButton}
                                        disabled={imageLoading ? true : false}
                                    >
                                        {imageUploaded
                                            ? "Done"
                                            : "Upload Photo"}
                                        {imageLoading && (
                                            <CircularProgress
                                                style={{ position: "absolute" }}
                                            />
                                        )}
                                    </Button>
                                    <Fab
                                        onClick={this.handleEditPicture}
                                        color="primary"
                                        style={{ marginLeft: 10 }}
                                        size="medium"
                                        disabled={imageLoading ? true : false}
                                    >
                                        {imageLoading ? (
                                            <CircularProgress />
                                        ) : imageUploaded ? (
                                            <Check />
                                        ) : (
                                            <CloudUpload />
                                        )}
                                    </Fab>
                                </div>
                                {imageInputErrorMessage && (
                                    <Typography
                                        variant="body2"
                                        className={classes.photoUploaded}
                                    >
                                        {imageInputErrorMessage}
                                    </Typography>
                                )}*/}
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
                    case 6:
                        return (
                            <>
                                <Card imageUrl={imageUrl} price={price} />
                                <div
                                    onClick={this.handleSubmit}
                                    className="confirm-post-button"
                                >
                                    Post
                                </div>
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
