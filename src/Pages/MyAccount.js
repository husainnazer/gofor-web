import React, { useState, useEffect } from "react";
import fire from "../firebase";
import "firebase/auth";

const MyAccount = () => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const { uid } = fire.auth().currentUser;
        let tempChats = [];
        fire.firestore()
            .collection("chats")
            .where("seller", "==", uid)
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    console.log(doc);
                });
            });
    }, []);

    return (
        <>
            {chats.map((chat) => (
                <h1>{chat.chatId}</h1>
            ))}
        </>
    );
};

export default MyAccount;
