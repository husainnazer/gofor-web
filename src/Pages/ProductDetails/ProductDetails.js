import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import fire from "../../firebase";
import "firebase/firestore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// import Chat from "../Chat/Chat";
import { useParams, useHistory } from "react-router-dom";

import "./ProductDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faExclamationTriangle,
    faCommentDots,
} from "@fortawesome/free-solid-svg-icons";

const ProductDetails = () => {
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);

    // const [productId, setProductId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [currentUid, setCurrentUid] = useState("");
    const [sellerUid, setSellerUid] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [imageWidth, setImageWidth] = useState("");
    const [imageHeight, setImageHeight] = useState("");
    const [showEmail, setShowEmail] = useState(false);
    const [showName, setShowName] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState("");
    const [userChats, setUserChats] = useState([]);
    const [buyClick, setBuyClick] = useState(false);
    const [isMyPost, setIsMyPost] = useState(false);

    const { productId } = useParams();

    useEffect(() => {
        fire.firestore()
            .collection("products")
            .doc(productId)
            .get()
            .then((data) => {
                if (data.data().uid === fire.auth().currentUser.uid) {
                    setIsMyPost(true);
                } else {
                    setIsMyPost(false);
                }
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
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                setAuthenticated(true);
                setCurrentUid(user.uid);
                fire.firestore()
                    .collection("users")
                    .doc(user.uid)
                    .get()
                    .then((doc) => {
                        setUserChats(doc.data().chats);
                    });
            } else {
                setAuthenticated(false);
            }
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
        if (authenticated) {
            if (sellerUid !== currentUid) {
                if (!userChats.some((list) => list.productId === productId)) {
                    fire.firestore()
                        .collection("chats")
                        .add({
                            messages: [],
                            buyer: currentUid,
                            seller: sellerUid,
                            createdAt: new Date().toISOString(),
                        })
                        .then((doc) => {
                            const newChatList = {
                                productId: productId,
                                chatId: doc.id,
                                productImage: imageUrl,
                                productName: title,
                                productPrice: price,
                            };
                            fire.firestore()
                                .collection("users")
                                .doc(currentUid)
                                .update({
                                    chats: firebase.firestore.FieldValue.arrayUnion(
                                        newChatList
                                    ),
                                })
                                .then(() => {
                                    fire.firestore()
                                        .collection("users")
                                        .doc(sellerUid)
                                        .update({
                                            chats: firebase.firestore.FieldValue.arrayUnion(
                                                newChatList
                                            ),
                                        });
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                            setChatLoading(false);
                            history.push(`/chat/${doc.id}`);
                        })
                        .catch((err) => {
                            console.log(err);
                            errorFunc(err);
                        });
                } else {
                    userChats.filter((list) => {
                        if (list.productId === productId) {
                            history.push(`/chat/${list.chatId}`);
                        }
                    });
                }
            } else {
                setChatLoading(false);
                errorFunc("You cant talk to you, knucklehead");
            }
        } else {
            setChatLoading(false);
            errorFunc("Login to your account to start a conversation");
        }
    };

    const errorFunc = (err) => {
        setError(err);
        setTimeout(() => {
            setError("");
        }, 3000);
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
                    <div
                        onClick={() => {
                            setBuyClick(!buyClick);
                        }}
                        className="product-details-buy-button"
                    >
                        Buy Now
                    </div>
                    <div
                        onClick={onContactSeller}
                        style={
                            !buyClick
                                ? { display: "none" }
                                : { display: "block" }
                        }
                        className="buy-now-chat-icon"
                    >
                        <FontAwesomeIcon icon={faCommentDots} />
                    </div>
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
                    {error && (
                        <div className="universal-error-popup">
                            <FontAwesomeIcon
                                style={{ marginRight: "10px" }}
                                icon={faExclamationTriangle}
                            />
                            {error}
                        </div>
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
