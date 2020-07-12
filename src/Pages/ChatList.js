import React, { useState, useEffect } from "react";
import fire from "../firebase";
import "firebase/auth";
import { useHistory } from "react-router-dom";

const ChatList = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [currentUid, setCurrentUid] = useState("");
    const [arr, setArr] = useState([]);

    useEffect(() => {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                setAuthenticated(true);
                setCurrentUid(user.uid);
                fire.firestore()
                    .collection("users")
                    .doc(user.uid)
                    .get()
                    .then((doc) => {
                        setArr(doc.data().chats);
                    });
            } else {
                setAuthenticated(false);
                setCurrentUid("");
            }
        });
    }, []);

    let history = useHistory();

    if (authenticated) {
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
                </>
            );
        }
    } else {
        return <h1>auth...</h1>;
    }
};

export default ChatList;
