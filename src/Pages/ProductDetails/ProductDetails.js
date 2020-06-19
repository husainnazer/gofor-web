import React, { Component } from "react";
import fire from "../../firebase";
import "firebase/firestore";
import CustomLink from "../../CustomLink";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// import Chat from "../Chat/Chat";
import { useHistory } from "react-router-dom";

import "./ProductDetails.css";
import { Redirect } from "react-router-dom";

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
            createdAt: "",
            uid: "",
            email: "",
            name: "",
            imageWidth: "",
            imageHeight: "",
            showEmail: false,
            showName: false,
            chatId: "",
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
                    createdAt: data.data().createdAt,
                    uid: data.data().uid,
                });
                this.setState({ loading: false });
                fire.firestore()
                    .collection("users")
                    .doc(this.state.uid)
                    .get()
                    .then((data) => {
                        this.setState({
                            name: data.data().name,
                            email: data.data().email,
                            loading: false,
                        });
                    });
            });
    }
    imgEl = React.createRef();
    imageOnLoad = () => {
        this.setState({
            imageHeight: this.imgEl.current.naturalHeight,
            imageWidth: this.imgEl.current.naturalWidth,
        });
    };

    onContactSeller = () => {
        fire.firestore()
            .collection("chats")
            .add({
                createdAt: new Date().toISOString(),
                messages: [],
            })
            .then((doc) => {
                this.setState({ chatId: doc.id });
            });
    };

    render() {
        dayjs.extend(relativeTime);
        const { imageUrl, imageHeight, imageWidth } = this.state;
        if (!this.state.loading) {
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
                        <p className="product-details-title">
                            {this.state.title}
                        </p>
                        <hr style={{ opacity: 0.25 }} />
                        <p className="product-details-price">{`₹ ${this.state.price}`}</p>
                        <div className="product-details-buy-button">
                            Buy Now
                        </div>
                        <p className="product-details-createdAt">
                            {`${dayjs(this.state.createdAt).fromNow()}`}
                        </p>
                        <hr />
                        <p className="product-details-title">Seller Details</p>
                        <div
                            className="product-details-show-button"
                            onClick={() => {
                                this.setState({ showEmail: true });
                            }}
                        >
                            {!this.state.showEmail
                                ? "Show Email"
                                : this.state.email}
                        </div>
                        <div
                            className="product-details-show-button"
                            onClick={() => {
                                this.setState({ showName: true });
                            }}
                            style={{ marginTop: "20px" }}
                        >
                            {!this.state.showName
                                ? "Show Name"
                                : this.state.name}
                        </div>
                        <CustomLink
                            tag="div"
                            chatId={this.state.chatId}
                            to={`/chat/${this.state.chatId}`}
                            className="product-details-contact-seller-button"
                            onClick={this.onContactSeller}
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                        >
                            Contact Seller
                        </CustomLink>
                    </div>
                </>
            );
        } else {
            return (
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
            );
        }
    }
}

export default ProductDetails;

// import React, { Component, useState } from "react";
// import fire from "../../firebase";
// import "firebase/firestore";
// import CustomLink from "../../CustomLink";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// // import Chat from "../Chat/Chat";
// import { useParams, useHistory } from "react-router-dom";

// import "./ProductDetails.css";
// import { Redirect } from "react-router-dom";

// const ProductDetails = () => {
//     const [loading, setLoading] = useState(true);
//     // const [productId, setProductId] = useState("");
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [price, setPrice] = useState("");
//     const [imageUrl, setImageUrl] = useState("");
//     const [createdAt, setCreatedAt] = useState("");
//     const [uid, setUid] = useState("");
//     const [email, setEmail] = useState("");
//     const [name, setName] = useState("");
//     const [imageWidth, setImageWidth] = useState("");
//     const [imageHeight, setImageHeight] = useState("");
//     const [showEmail, setShowEmail] = useState(false);
//     const [showName, setShowName] = useState(false);
//     const [chatId, setChatId] = useState("");

//     const { productId } = useParams();
//     fire.firestore()
//         .collection("products")
//         .doc(productId)
//         .get()
//         .then((data) => {
//             setTitle(data.data().title);
//             setPrice(data.data().price);
//             setDescription(data.data().description);
//             setImageUrl(data.data().imageUrl);
//             setCreatedAt(data.data().createdAt);
//             setUid(data.data().uid);
//             setLoading(false);
//             fire.firestore()
//                 .collection("users")
//                 .doc(data.data().uid)
//                 .get()
//                 .then((data) => {
//                     setName(data.data().name);
//                     setEmail(data.data().email);
//                     setLoading(false);
//                 });
//         });

//     dayjs.extend(relativeTime);
//     const imgEl = React.createRef();
//     const imageOnLoad = () => {
//         setImageHeight(imgEl.current.naturalHeight);
//         setImageWidth(imgEl.current.naturalWidth);
//     };
//     let history = useHistory();
//     const onContactSeller = () => {
//         fire.firestore()
//             .collection("chats")
//             .add({
//                 createdAt: new Date().toISOString(),
//                 messages: [],
//             })
//             .then((doc) => {
//                 history.push(`/chat/${doc.id}`);
//             });
//     };
//     if (!loading) {
//         return (
//             <>
//                 <div
//                     className={
//                         imageHeight > imageWidth
//                             ? "product-details-image-div-portrait"
//                             : "product-details-image-div-landscape"
//                     }
//                 >
//                     <img
//                         alt="product-haha"
//                         ref={imgEl}
//                         src={imageUrl}
//                         id="product-details-image"
//                         className={
//                             imageHeight > imageWidth
//                                 ? "product-details-image-portrait"
//                                 : "product-details-image-landscape"
//                         }
//                         onLoad={imageOnLoad}
//                     />
//                 </div>
//                 <div className="product-details-div">
//                     <p className="product-details-title">{title}</p>
//                     <hr style={{ opacity: 0.25 }} />
//                     <p className="product-details-price">{`₹ ${price}`}</p>
//                     <div className="product-details-buy-button">Buy Now</div>
//                     <p className="product-details-createdAt">
//                         {`${dayjs(createdAt).fromNow()}`}
//                     </p>
//                     <hr />
//                     <p className="product-details-title">Seller Details</p>
//                     <div
//                         className="product-details-show-button"
//                         onClick={() => {
//                             setShowEmail(true);
//                         }}
//                     >
//                         {!showEmail ? "Show Email" : email}
//                     </div>
//                     <div
//                         className="product-details-show-button"
//                         onClick={() => {
//                             setShowName(true);
//                         }}
//                         style={{ marginTop: "20px" }}
//                     >
//                         {!showName ? "Show Name" : name}
//                     </div>
//                     <CustomLink
//                         tag="div"
//                         // chatId={chatId}
//                         // to={`/chat/${chatId}`}
//                         className="product-details-contact-seller-button"
//                         onClick={onContactSeller}
//                         style={{ marginTop: "20px", marginBottom: "20px" }}
//                     >
//                         Contact Seller
//                     </CustomLink>
//                 </div>
//             </>
//         );
//     } else {
//         return (
//             <div
//                 style={{
//                     position: "absolute",
//                     width: "50px",
//                     height: "50px",
//                     left: "50%",
//                     top: "50%",
//                     transform: `translate(${-50}%, ${-50}%)`,
//                 }}
//                 className="loading-animation-scroll-home"
//             ></div>
//         );
//     }
// };

// export default ProductDetails;
