import React, { Component } from "react";
import { Grid, Typography } from "@material-ui/core";
import fire from "../firebase";
import "firebase/auth";
import "firebase/firestore";
import { Link } from "react-router-dom";
import Card from "../Components/Card/Card";
import Logo from "../logo.png";

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
        const { myPosts } = this.state;
        return (
            <>
                <Link to="/">
                    <img alt="Gofor" src={Logo} className="logo-universal" />
                </Link>
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
                                <Card
                                    imageUrl={product.imageUrl}
                                    price={product.price}
                                    title={product.title}
                                />
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </>
        );
    }
}

export default Profile;
