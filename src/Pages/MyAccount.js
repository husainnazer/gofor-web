import React, { useState, useEffect } from "react";
import fire from "../firebase";
import "firebase/auth";
import { useHistory } from "react-router-dom";

const MyAccount = () => {
    const [arr, setArr] = useState([]);

    useEffect(() => {
        fire.firestore()
            .collection("users")
            .doc(fire.auth().currentUser.uid)
            .get()
            .then((doc) => {
                setArr(doc.data().chats);
            });
    }, []);

    let history = useHistory();

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
};

export default MyAccount;
