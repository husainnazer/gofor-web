import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";

//Material UI stuff
import {
    InputLabel,
    MenuItem,
    Select,
    FormControl,
    Grid,
    TextField,
    Typography,
    Button,
    Fab,
    CircularProgress,
} from "@material-ui/core/";

import { Check, CloudUpload } from "@material-ui/icons";

//Firebase stuff
import fire from "../firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

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
    button: {
        marginTop: 20,
        position: "relative",
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
            category: "",
            title: "",
            description: "",
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

        if (category === "") {
            this.setState({ categoryErrorMessage: "Must not be empty" });
        }
        if (title === "") {
            this.setState({ titleErrorMessage: "Title must not be empty" });
        }
        if (description === "") {
            this.setState({
                descriptionErrorMessage: "Description must not be empty",
            });
        }
        if (price === "") {
            this.setState({ priceErrorMessage: "Price must not be empty" });
        }
        if (imageUrl === "") {
            this.setState({
                imageInputErrorMessage: "Add photo of your product",
            });
        }
        if (
            category !== "" &&
            title !== "" &&
            description !== "" &&
            price !== "" &&
            imageUrl !== ""
        ) {
            // const noImgUrl = 'https://firebasestorage.googleapis.com/v0/b/gofor-efc3a.appspot.com/o/no-image.png?alt=media'
            const newProduct = {
                title: this.state.title,
                description: this.state.description,
                category: this.state.category,
                userId: uid,
                userHandle: displayName,
                price: this.state.price,
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

    render() {
        const { classes } = this.props;
        const { authenticated } = this.props.location;
        const {
            posted,
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
                return (
                    <Grid container className={classes.form}>
                        <Grid item sm />
                        <Grid item sm>
                            <div>
                                <Typography
                                    className={classes.pageTitle}
                                    variant="h2"
                                >
                                    Post
                                </Typography>
                                <FormControl
                                    variant="outlined"
                                    className={classes.categoryForm}
                                    error={categoryErrorMessage ? true : false}
                                >
                                    <InputLabel id="product-category-label">
                                        Category
                                    </InputLabel>
                                    <Select
                                        id="category"
                                        name="category"
                                        labelId="category"
                                        value={this.state.category}
                                        onChange={this.handleChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="mobiles">
                                            Mobiles
                                        </MenuItem>
                                        <MenuItem value="properties">
                                            Properties
                                        </MenuItem>
                                        <MenuItem value="cars">Cars</MenuItem>
                                    </Select>
                                </FormControl>
                                {categoryErrorMessage && (
                                    <Typography
                                        variant="body2"
                                        className={classes.customError}
                                    >
                                        {categoryErrorMessage}
                                    </Typography>
                                )}
                                <TextField
                                    id="title"
                                    name="title"
                                    type="text"
                                    label="Title"
                                    className={classes.textField}
                                    noValidate
                                    autoComplete="off"
                                    variant="outlined"
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                    error={titleErrorMessage ? true : false}
                                    helperText={titleErrorMessage}
                                    fullWidth
                                />
                                <TextField
                                    id="description"
                                    name="description"
                                    type="text"
                                    label="Description"
                                    className={classes.textField}
                                    noValidate
                                    autoComplete="off"
                                    variant="outlined"
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                    error={
                                        descriptionErrorMessage ? true : false
                                    }
                                    helperText={descriptionErrorMessage}
                                    fullWidth
                                />
                                <TextField
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
                                <input
                                    accept="image/*"
                                    onChange={this.handleImageChange}
                                    className={classes.input}
                                    id="imageInput"
                                    type="file"
                                />
                                <div style={{ marginTop: "10px" }}>
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
                                )}
                            </div>
                            <Button
                                onClick={this.handleSubmit}
                                variant="contained"
                                color="primary"
                                className={classes.button}
                            >
                                Post
                            </Button>
                        </Grid>
                        <Grid item sm />
                    </Grid>
                );
            } else {
                return <Redirect to="/" />;
            }
        } else {
            return (
                <Redirect
                    to={{
                        pathname: "/login",
                        authenticatedToPost: true,
                    }}
                />
            );
        }
    }
}

export default withStyles(styles)(PostProduct);
