import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Chat.css";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/app";
import fire from "../../firebase";
import "firebase/firestore";
import "firebase/auth";

class Chat extends Component {
    constructor() {
        super();
        this.state = {
            message: "",
            messages: {},
        };
    }

    onMessageInput = (event) => {
        this.setState({ message: event.target.value });
        console.log("temp", this.state.message);
    };

    onMessageSubmit = () => {
        this.setState({ messages: this.state.message });
        console.log("permanent", this.state.messages);
        this.setState({ message: "" });
        fire.firestore()
            .collection("chats")
            .add({
                createdAt: new Date().toISOString(),
                messages: [],
            })
            .then((doc) => {
                const docId = doc.id;
                const message = {
                    uid: fire.auth().currentUser.uid,
                    content: this.state.message,
                };
                fire.firestore()
                    .collection("chats")
                    .doc(docId)
                    .update({
                        messages: firebase.firestore.FieldValue.arrayUnion(
                            message
                        ),
                    })
                    .then(() => console.log("success"))
                    .catch((err) => console.log(err));
            });
    };

    render() {
        return (
            <>
                <div className="chat-component-container">
                    <article className="msg-container msg-remote" id="msg-0">
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
                    </article>
                    <article className="msg-container msg-self" id="msg-0">
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
                    </article>
                    <article className="msg-container msg-remote" id="msg-0">
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
                    </article>
                    <article className="msg-container msg-self" id="msg-0">
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
                    </article>
                    <article className="msg-container msg-remote" id="msg-0">
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
                    </article>
                    <article className="msg-container msg-self" id="msg-0">
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
                    </article>
                    <article className="msg-container msg-remote" id="msg-0">
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
                    </article>
                    <article className="msg-container msg-self" id="msg-0">
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
                    </article>
                    <article className="msg-container msg-remote" id="msg-0">
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
                    </article>
                    <article className="msg-container msg-self" id="msg-0">
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
                    </article>
                    <article className="msg-container msg-remote" id="msg-0">
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
                    </article>
                    <article className="msg-container msg-self" id="msg-0">
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
                    </article>
                    <article className="msg-container msg-remote" id="msg-0">
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
                    </article>
                    <article className="msg-container msg-self" id="msg-0">
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
                    </article>
                    <div className="chat-message-input-container">
                        <div className="chat-message-input-div">
                            <input
                                value={this.state.message}
                                onChange={this.onMessageInput}
                                placeholder="Say Hi"
                                className="chat-message-input"
                            />
                        </div>
                        <div
                            onClick={this.onMessageSubmit}
                            className="chat-message-send-button"
                        >
                            <FontAwesomeIcon
                                className="chat-message-send-button-icon"
                                icon={faPaperPlane}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Chat;

{
    /* <div id="chat-message-list" className="chat-message-list">
    <div className="chat-message-row your-message">
        <div className="chat-message-text">You're welcome</div>
        <div className="chat-message-time">Apr 16</div>
    </div>
    <div className="chat-message-row other-message">
        <div className="chat-message-text">Thank you</div>
        <div className="chat-message-time">Apr 16</div>
    </div>
</div>; */
}
