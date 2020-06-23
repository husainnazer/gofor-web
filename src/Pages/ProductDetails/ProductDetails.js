import React, { useState, useEffect } from "react";
import fire from "../../firebase";
import "firebase/firestore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// import Chat from "../Chat/Chat";
import { useParams, useHistory } from "react-router-dom";

import "./ProductDetails.css";

const ProductDetails = () => {
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);

    // const [productId, setProductId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [sellerUid, setSellerUid] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [imageWidth, setImageWidth] = useState("");
    const [imageHeight, setImageHeight] = useState("");
    const [showEmail, setShowEmail] = useState(false);
    const [showName, setShowName] = useState(false);
    // const [chatId, setChatId] = useState("");

    const { productId } = useParams();

    useEffect(() => {
        fire.firestore()
            .collection("products")
            .doc(productId)
            .get()
            .then((data) => {
                setTitle(data.data().title);
                setPrice(data.data().price);
                setDescription(data.data().description);
                setImageUrl(data.data().imageUrl);
                setCreatedAt(data.data().createdAt);
                setSellerUid(data.data().uid);
                setLoading(false);
                fire.firestore()
                    .collection("users")
                    .doc(data.data().uid)
                    .get()
                    .then((data) => {
                        setName(data.data().name);
                        setEmail(data.data().email);
                        setLoading(false);
                    });
            });
    }, [productId]);

    dayjs.extend(relativeTime);
    const imgEl = React.createRef();

    const imageOnLoad = () => {
        setImageHeight(imgEl.current.naturalHeight);
        setImageWidth(imgEl.current.naturalWidth);
    };

    let history = useHistory();

    const onContactSeller = () => {
        setChatLoading(true);
        fire.firestore()
            .collection("chats")
            .add({
                messages: [],
                buyer: fire.auth().currentUser.uid,
                seller: sellerUid,
                createdAt: new Date().toISOString(),
            })
            .then((doc) => {
                setChatLoading(false);
                history.push(`/chat/${doc.id}`);
            });
    };

    if (!loading) {
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
                        ref={imgEl}
                        src={imageUrl}
                        id="product-details-image"
                        className={
                            imageHeight > imageWidth
                                ? "product-details-image-portrait"
                                : "product-details-image-landscape"
                        }
                        onLoad={imageOnLoad}
                    />
                </div>
                <div className="product-details-div">
                    <p className="product-details-title">{title}</p>
                    <hr style={{ opacity: 0.25 }} />
                    <p className="product-details-price">{`₹ ${price}`}</p>
                    <div className="product-details-buy-button">Buy Now</div>
                    <p className="product-details-createdAt">
                        {`${dayjs(createdAt).fromNow()}`}
                    </p>
                    <hr />
                    <p className="product-details-title">Seller Details</p>
                    <div
                        className="product-details-show-button"
                        onClick={() => {
                            setShowEmail(true);
                        }}
                    >
                        {!showEmail ? "Show Email" : email}
                    </div>
                    <div
                        className="product-details-show-button"
                        onClick={() => {
                            setShowName(true);
                        }}
                        style={{ marginTop: "20px" }}
                    >
                        {!showName ? "Show Name" : name}
                    </div>
                    <div
                        className="product-details-contact-seller-button"
                        onClick={onContactSeller}
                        style={{ marginTop: "20px", marginBottom: "20px" }}
                    >
                        Contact Seller
                    </div>
                    {chatLoading && (
                        <div
                            style={{ transform: `translateX(${-50}%)` }}
                            className="loading-animation-scroll-home"
                        ></div>
                    )}
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
};

export default ProductDetails;
