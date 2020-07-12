import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Chat.css";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/app";
import fire from "../../firebase";
import "firebase/firestore";
import "firebase/auth";
import { useParams } from "react-router-dom";

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentUid, setCurrentUid] = useState("");
    const [sellerUid, setSellerUid] = useState("");
    const [buyerUid, setBuyerUid] = useState("");
    const [authenticated, setAuthenticated] = useState(false);

    const { chatId } = useParams();

    useEffect(() => {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                setAuthenticated(true);
                setCurrentUid(user.uid);
            } else {
                setAuthenticated(false);
                setCurrentUid("");
            }
        });
        fire.firestore()
            .collection("chats")
            .doc(chatId)
            .onSnapshot((data) => {
                let messagesArr = [];
                data.data().messages.forEach((doc) => {
                    messagesArr.push(doc);
                });
                setMessages(messagesArr);
                setSellerUid(data.data().seller);
                setBuyerUid(data.data().buyer);
            });
    }, [chatId]);

    const onMessageInput = (event) => {
        setMessage(event.target.value);
        // console.log("temp", event.target.value);
    };

    const onKeyPress = (event) => {
        if (event.keyCode === 13) {
            onMessageSubmit();
        }
        console.log(event.keyCode);
    };

    const onMessageSubmit = () => {
        if (message.trim() !== "") {
            const newMessage = {
                content: message,
                createdAt: new Date().toISOString(),
                uid: currentUid,
                // uid: fire.auth().currentUser.uid,
            };
            fire.firestore()
                .collection("chats")
                .doc(chatId)
                .update({
                    messages: firebase.firestore.FieldValue.arrayUnion(
                        newMessage
                    ),
                })
                .then(() => {
                    console.log("success");
                    setMessage("");
                })
                .catch((err) => console.log(err));
        }
    };
    if (authenticated) {
        if (currentUid === sellerUid || currentUid === buyerUid) {
            return (
                <>
                    <div className="chat-component-container">
                        {messages.map((data) => (
                            <article
                                className={
                                    // data.uid === fire.auth().currentUser.uid
                                    data.uid === currentUid
                                        ? "msg-container msg-self"
                                        : "msg-container msg-remote"
                                }
                                id="msg-0"
                            >
                                <div className="msg-box">
                                    <div className="flr">
                                        <div className="messages">
                                            <p className="msg" id="msg-1">
                                                {data.content}
                                            </p>
                                        </div>
                                        <span className="timestamp">
                                            <span className="username"></span>
                                            &bull;
                                            <span className="posttime">
                                                Now
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                        {/* <article className="msg-container msg-remote" id="msg-0">
                                <div className="msg-box">
                                    <div className="flr">
                                        <div className="messages">
                                            <p className="msg" id="msg-0">
                                                Lorem ipsum dolor sit amet.
                                            </p>
                                        </div>
                                        <span className="timestamp">
                                            <span className="username"></span>&bull;
                                            <span className="posttime">Now</span>
                                        </span>
                                    </div>
                                </div>
                            </article> */}
                    </div>
                    <div className="chat-message-input-container">
                        <div className="chat-message-input-div">
                            <input
                                value={message}
                                onChange={onMessageInput}
                                onKeyDown={onKeyPress}
                                placeholder="Say Hi"
                                className="chat-message-input"
                            />
                        </div>
                        <div
                            onClick={onMessageSubmit}
                            className="chat-message-send-button"
                        >
                            <FontAwesomeIcon
                                className="chat-message-send-button-icon"
                                icon={faPaperPlane}
                            />
                        </div>
                    </div>
                </>
            );
        } else {
            return <h1>You're not allowed</h1>;
        }
    } else {
        return <h1>Loading...</h1>;
    }
};

export default Chat;
