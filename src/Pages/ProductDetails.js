import React, { Component } from "react";
import fire from "../firebase";
import "firebase/firestore";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Grid,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { withStyles } from "@material-ui/styles";

const styles = {
    form: {
        textAlign: "center",
    },
    photoCard: {
        height: 500,
        maxWidth: 630,
    },
    photoImage: {
        height: 500,
    },
    priceCard: {
        height: 240,
        maxWidth: 315,
    },
    priceImage: {
        height: 250,
    },
    content: {
        padding: 25,
        objectFit: "cover",
    },
};

class ProductDetails extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            productId: "",
            title: "",
            price: "",
            imageUrl: "",
            userHandle: "",
            email: "",
        };
    }

    componentDidMount() {
        const productId = this.props.match.params.productId;
        this.setState({ productId: productId });
        fire.firestore()
            .collection("products")
            .doc(productId)
            .get()
            .then((data) => {
                this.setState({
                    title: data.data().title,
                    price: data.data().price,
                    description: data.data().description,
                    imageUrl: data.data().imageUrl,
                    userHandle: data.data().userHandle,
                });
                this.setState({ loading: false });
                // fire.firestore()
                //     .collection('users')
                //     .doc(data.data().userHandle)
                //     .get()
                //     .then(data => {
                //         this.setState({email: data.data().email})
                //     })
            });
    }

    render() {
        const { classes } = this.props;
        const { loading } = this.state;
        if (!loading) {
            return (
                <Grid container className={classes.form}>
                    <Grid item sm>
                        <Card className={classes.photoCard}>
                            <CardMedia
                                className={classes.photoImage}
                                image={this.state.imageUrl}
                                title="Contemplative Reptile"
                            />
                        </Card>
                    </Grid>
                    <Grid item sm>
                        <Card
                            className={classes.priceCard}
                            style={{ marginLeft: 30 }}
                        >
                            <CardContent>
                                <Typography
                                    color="textSecondary"
                                    variant="overline"
                                >
                                    Product Details
                                </Typography>
                                <Typography
                                    variant="h5"
                                    style={{ marginTop: 10 }}
                                >
                                    {this.state.title}
                                </Typography>
                                {/* <Typography>{this.state.description}</Typography> */}
                                <Typography
                                    gutterBottom
                                    variant="h4"
                                    style={{ marginTop: 5 }}
                                >
                                    {`₹ ${this.state.price}/-`}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card
                            className={classes.priceCard}
                            style={{ marginLeft: 30, marginTop: 20 }}
                        >
                            <CardContent>
                                <Typography
                                    color="textSecondary"
                                    variant="overline"
                                >
                                    Seller Details
                                </Typography>
                                <Typography
                                    variant="h5"
                                    style={{ marginTop: 10 }}
                                >
                                    {this.state.userHandle}
                                </Typography>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    style={{ marginTop: 5 }}
                                >
                                    {this.state.email
                                        ? this.state.email
                                        : "no email"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <Grid container>
                    <Grid item sm>
                        <Skeleton
                            animation="wave"
                            variant="rect"
                            width={600}
                            height={500}
                        />
                    </Grid>
                    <Grid item sm>
                        <Card
                            className={classes.priceCard}
                            style={{
                                marginLeft: 30,
                                backgroundColor: "#f2f2f2",
                            }}
                        >
                            <Skeleton
                                animation="wave"
                                style={{
                                    width: 150,
                                    marginLeft: 77,
                                    marginTop: 17,
                                    padding: 5,
                                }}
                            />
                            <Skeleton
                                animation="wave"
                                style={{
                                    width: 170,
                                    marginLeft: 65,
                                    marginTop: 14,
                                    padding: 8,
                                }}
                            />
                            <Skeleton
                                animation="wave"
                                style={{
                                    width: 170,
                                    marginLeft: 65,
                                    marginTop: 6,
                                    padding: 8,
                                }}
                            />
                        </Card>
                        <Card
                            className={classes.priceCard}
                            style={{
                                marginLeft: 30,
                                marginTop: 20,
                                backgroundColor: "#f2f2f2",
                            }}
                        >
                            <Skeleton
                                animation="wave"
                                style={{
                                    width: 150,
                                    marginLeft: 77,
                                    marginTop: 17,
                                    padding: 5,
                                }}
                            />
                            <Skeleton
                                animation="wave"
                                style={{
                                    width: 170,
                                    marginLeft: 65,
                                    marginTop: 14,
                                    padding: 8,
                                }}
                            />
                            <Skeleton
                                animation="wave"
                                style={{
                                    width: 170,
                                    marginLeft: 65,
                                    marginTop: 6,
                                    padding: 8,
                                }}
                            />
                        </Card>
                    </Grid>
                </Grid>
            );
            // return(
            //     <div>
            //         <Skeleton variant="text" />
            //         <Skeleton variant="circle" width={40} height={40} />
            //         <Skeleton variant="rect" width={600} height={500} />
            //     </div>
            // )
        }
    }
}

export default withStyles(styles)(ProductDetails);
