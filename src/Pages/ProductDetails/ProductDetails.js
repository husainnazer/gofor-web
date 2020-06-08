import React, { Component } from "react";
import fire from "../../firebase";
import "firebase/firestore";

import "./ProductDetails.css";

class ProductDetails extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            productId: "",
            title: "",
            description: "",
            price: "",
            imageUrl: "",
            userHandle: "",
            email: "",
            imageWidth: "",
            imageHeight: "",
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
    imgEl = React.createRef();
    imageOnLoad = () => {
        this.setState({
            imageHeight: this.imgEl.current.naturalHeight,
            imageWidth: this.imgEl.current.naturalWidth,
        });
    };

    render() {
        const { imageUrl, imageHeight, imageWidth } = this.state;
        return (
            <>
                <div
                    className={
                        imageHeight > imageWidth
                            ? "product-details-image-div-portrait"
                            : "product-details-image-div-landscape"
                    }
                >
                    <img
                        alt="product-haha"
                        ref={this.imgEl}
                        src={imageUrl}
                        id="product-details-image"
                        className={
                            imageHeight > imageWidth
                                ? "product-details-image-portrait"
                                : "product-details-image-landscape"
                        }
                        onLoad={this.imageOnLoad}
                    />
                </div>
                <div className="product-details-div">
                    <h1>{this.state.title}</h1>
                    <p>{this.state.description}</p>
                </div>
            </>
        );
    }
}

export default ProductDetails;

// <Grid container className={classes.form}>
//     <Grid item sm>
//         <Card className={classes.photoCard}>
//             <CardMedia
//                 className={classes.photoImage}
//                 image={this.state.imageUrl}
//                 title="Product Image"
//             />
//         </Card>
//     </Grid>
//     <Grid item sm>
//         <Card
//             className={classes.priceCard}
//             style={{ marginLeft: 30 }}
//         >
//             <CardContent>
//                 <Typography
//                     color="textSecondary"
//                     variant="overline"
//                 >
//                     Product Details
//                 </Typography>
//                 <Typography variant="h5" style={{ marginTop: 10 }}>
//                     {this.state.title}
//                 </Typography>
//                 {/* <Typography>{this.state.description}</Typography> */}
//                 <Typography
//                     gutterBottom
//                     variant="h4"
//                     style={{ marginTop: 5 }}
//                 >
//                     {`₹ ${this.state.price}/-`}
//                 </Typography>
//             </CardContent>
//         </Card>
//         <Card
//             className={classes.priceCard}
//             style={{ marginLeft: 30, marginTop: 20 }}
//         >
//             <CardContent>
//                 <Typography
//                     color="textSecondary"
//                     variant="overline"
//                 >
//                     Seller Details
//                 </Typography>
//                 <Typography variant="h5" style={{ marginTop: 10 }}>
//                     {this.state.userHandle}
//                 </Typography>
//                 <Typography
//                     gutterBottom
//                     variant="h6"
//                     style={{ marginTop: 5 }}
//                 >
//                     {this.state.email
//                         ? this.state.email
//                         : "no email"}
//                 </Typography>
//             </CardContent>
//         </Card>
//     </Grid>
// </Grid>
