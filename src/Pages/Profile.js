import React, { Component } from "react";
import {
    Grid,
    Typography,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import fire from "../firebase";
import "firebase/auth";
import "firebase/firestore";
import { Link } from "react-router-dom";

const styles = {
    card: {
        maxWidth: 345,
        marginBottom: 30,
    },
    image: {
        height: 180,
    },
    content: {
        padding: 5,
        margin: 15,
        objectFit: "cover",
    },
};

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            myPosts: [],
        };
    }

    componentDidMount() {
        const { displayName } = fire.auth().currentUser;
        let Products = [];
        fire.firestore()
            .collection("products")
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    if (doc.data().userHandle === displayName) {
                        Products.push({
                            productId: doc.id,
                            title: doc.data().title,
                            userHandle: doc.data().userHandle,
                            price: doc.data().price,
                            location: doc.data().location,
                            imageUrl: doc.data().imageUrl,
                            createdAt: doc.data().createdAt,
                        });
                    }
                });
                this.setState({ myPosts: Products });
                console.log(this.state.myPosts[0].title);
            });
    }

    render() {
        const { classes } = this.props;
        const { myPosts } = this.state;
        return (
            <>
                <Typography
                    style={{
                        textAlign: "center",
                        marginBottom: 20,
                    }}
                    variant="h2"
                >
                    My Posts
                </Typography>
                <Grid container spacing={1} style={{ padding: 24 }}>
                    {myPosts.map((product) => (
                        <Grid
                            key={product.productId}
                            item
                            xs={12}
                            sm={6}
                            lg={4}
                            xl={3}
                        >
                            <Link
                                to={`/product/${product.productId}`}
                                style={{ textDecoration: "none" }}
                            >
                                <Card className={classes.card}>
                                    <CardActionArea>
                                        <CardMedia
                                            image={product.imageUrl}
                                            title="Profile Image"
                                            className={classes.image}
                                        />
                                        <CardContent
                                            className={classes.content}
                                        >
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                            >
                                                ₹ {product.price}/-
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                color="textSecondary"
                                            >
                                                {product.title}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </>
        );
    }
}

export default withStyles(styles)(Profile);
