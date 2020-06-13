import React, { Component } from "react";

//Components
import Card from "../Components/Card/Card";
import Navbar from "../Components/Navbar/Navbar";

//Material-UI stuff
import { Grid } from "@material-ui/core/";

//React Router
import { Link } from "react-router-dom";

//Firebase Stuff
import fire from "../firebase";
import "firebase/firestore";

//Load by Scrolling
import InfiniteScroll from "react-infinite-scroller";

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
        const { allProducts, loading, visibleProducts, loadMore } = this.state;
        if (!loading) {
            return (
                <>
                    <Navbar />
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
                                <div className="loading-animation-scroll-home"></div>
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
                                            <Card
                                                imageUrl={product.imageUrl}
                                                price={product.price}
                                                title={product.title}
                                            />
                                        </Link>
                                    </Grid>
                                ))}
                        </Grid>
                    </InfiniteScroll>
                </>
            );
        } else {
            return (
                <>
                    <Navbar />
                    <div
                        style={{
                            position: "absolute",
                            width: "50px",
                            height: "50px",
                            left: "50%",
                            top: "50%",
                            transform: `translate(${-50}%, ${-50}%)`,
                        }}
                        className="loading-animation-scroll-home"
                    ></div>
                </>
            );
        }
    }
}

export default Home;
