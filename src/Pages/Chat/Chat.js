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

    const { chatId } = useParams();

    useEffect(() => {
        fire.firestore()
            .collection("chats")
            .doc(chatId)
            .get()
            .then((data) => {
                let messagesArr = [];
                data.data().messages.forEach((doc) => {
                    messagesArr.push(doc);
                });
                setMessages(messagesArr);
            });
    }, [messages, chatId]);

    const onMessageInput = (event) => {
        setMessage(event.target.value);
        console.log("temp", event.target.value);
    };

    const onKeyPress = (event) => {
        if (event.keyCode === 13) {
            onMessageSubmit();
        }
    };

    const onMessageSubmit = () => {
        setMessage("");
        const newMessage = {
            content: message,
            createdAt: new Date().toISOString(),
            uid: fire.auth().currentUser.uid,
        };
        fire.firestore()
            .collection("chats")
            .doc(chatId)
            .update({
                messages: firebase.firestore.FieldValue.arrayUnion(newMessage),
            })
            .then(() => console.log("success"))
            .catch((err) => console.log(err));
    };
    return (
        <>
            <div className="chat-component-container">
                {messages.map((data) => (
                    <article className="msg-container msg-self" id="msg-0">
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
                                    <span className="posttime">Now</span>
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
                {/* <article className="msg-container msg-self" id="msg-0">
                    <div className="msg-box">
                        <div className="flr">
                            <div className="messages">
                                <p className="msg" id="msg-1">
                                    Lorem ipsum
                                </p>
                            </div>
                            <span className="timestamp">
                                <span className="username">Name</span>&bull;
                                <span className="posttime">Now</span>
                            </span>
                        </div>
                    </div>
                </article> */}
                {/* <article className="msg-container msg-remote" id="msg-0">
                    <div className="msg-box">
                        <div className="flr">
                            <div className="messages">
                                <p className="msg" id="msg-0">
                                    Lorem ipsum dolor sit amet.
                                </p>
                            </div>
                            <span className="timestamp">
                                <span className="username">Name</span>&bull;
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
};

export default Chat;
