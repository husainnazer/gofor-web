import React, { useState, useEffect } from "react";
import fire from "../firebase";
import "firebase/auth";
import { useHistory } from "react-router-dom";

const ChatList = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [currentUid, setCurrentUid] = useState("");
    const [loading, setLoading] = useState(true);
    const [arr, setArr] = useState([]);

    useEffect(() => {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                // console.log(user.displayName);
                setAuthenticated(true);
                setCurrentUid(user.uid);
                fire.firestore()
                    .collection("users")
                    .doc(user.uid)
                    .get()
                    .then((doc) => {
                        setArr(doc.data().chats);
                    })
                    .then(() => {
                        setLoading(false);
                    });
            } else {
                setAuthenticated(false);
                setCurrentUid("");
            }
        });
    }, []);

    let history = useHistory();

    if (authenticated) {
        if (!loading) {
            if (!arr.length) {
                return <h1>No data</h1>;
            } else {
                return (
                    <>
                        {arr.map((list) => (
                            <div
                                onClick={() => {
                                    history.push(`/chat/${list.chatId}`);
                                }}
                                className="chat-list-container"
                            >
                                {list.chatId}
                            </div>
                        ))}
                        <h1>{currentUid}</h1>
                    </>
                );
            }
        } else {
            return <h1>Loading ...</h1>;
        }
    } else {
        return (
            <div onClick={() => history.push("/")}>
                Please Login to continue
            </div>
        );
    }
};

export default ChatList;
