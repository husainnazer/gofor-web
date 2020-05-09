import React, { Component } from "react";

//Material-UI stuff
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Typography,
    CircularProgress,
} from "@material-ui/core/";
import { withStyles } from "@material-ui/styles";
import { Skeleton } from "@material-ui/lab";

//React Router
import { Link } from "react-router-dom";

//Firebase Stuff
import fire from "../firebase";
import "firebase/firestore";

import InfiniteScroll from "react-infinite-scroller";

const styles = {
    card: {
        boxShadow: "none",
        maxWidth: 345,
        marginBottom: 30,
        borderColor: "#f2f2f2",
        borderStyle: "solid",
        borderWidth: "1px",
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

class Home extends Component {
    constructor() {
        super();
        this.state = {
            allProducts: [],
            visibleProducts: 15,
            addVisible: 9,
            loadMore: true,
            loading: true,
        };
    }

    componentDidMount() {
        fire.firestore()
            .collection("products")
            .orderBy("createdAt", "desc")
            .get()
            .then((data) => {
                let Products = [];
                data.forEach((doc) => {
                    Products.push({
                        productId: doc.id,
                        title: doc.data().title,
                        userHandle: doc.data().userHandle,
                        price: doc.data().price,
                        location: doc.data().location,
                        imageUrl: doc.data().imageUrl,
                        createdAt: doc.data().createdAt,
                    });
                });
                this.setState({ allProducts: Products });
                this.setState({ loading: false });
            });
    }

    // deleteButton = () => {
    //     fire.firestore()
    //         .collection("products")
    //         .doc("4JXIYGaoHb9ffTznoHTm")
    //         .delete()
    //         .then(() => {
    //             console.log("deleted successfully");
    //         })
    //         .catch((error) => {
    //             console.log("error", error);
    //         });
    // };

    loadMore = () => {
        const { visibleProducts, allProducts, addVisible } = this.state;
        this.setState({ visibleProducts: visibleProducts + addVisible });
        if (allProducts.length - addVisible <= visibleProducts) {
            this.setState({ loadMore: false });
        }
    };

    render() {
        const { classes } = this.props;
        const { allProducts, loading, visibleProducts, loadMore } = this.state;
        if (!loading) {
            return (
                <>
                    <InfiniteScroll
                        loadMore={this.loadMore}
                        hasMore={loadMore ? true : false}
                        loader={
                            <div
                                style={{
                                    textAlign: "center",
                                    marginBottom: 30,
                                }}
                            >
                                <CircularProgress />
                            </div>
                        }
                    >
                        <Grid container spacing={1} style={{ padding: 24 }}>
                            {allProducts
                                .slice(0, visibleProducts)
                                .map((product) => (
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
                                            style={{
                                                textDecoration: "none",
                                            }}
                                        >
                                            <Card className={classes.card}>
                                                <CardActionArea>
                                                    <CardMedia
                                                        image={product.imageUrl}
                                                        title="Profile Image"
                                                        className={
                                                            classes.image
                                                        }
                                                    />
                                                    <CardContent
                                                        className={
                                                            classes.content
                                                        }
                                                    >
                                                        <Typography
                                                            gutterBottom
                                                            variant="h5"
                                                        >
                                                            ₹ {product.price}
                                                            /-
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
                    </InfiniteScroll>
                </>
            );
        } else {
            const length = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            return (
                <Grid container spacing={1} style={{ padding: 24 }}>
                    {length.map((product) => (
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Skeleton
                                animation="wave"
                                variant="rect"
                                width={345}
                                height={180}
                            />
                            <Skeleton
                                animation="wave"
                                width={200}
                                style={{ marginTop: 15, padding: 8 }}
                            />
                            <Skeleton
                                animation="wave"
                                width={170}
                                style={{
                                    marginTop: 5,
                                    marginBottom: 44,
                                    padding: 8,
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            );
        }
    }
}

export default withStyles(styles)(Home);
