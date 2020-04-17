import firebase from 'firebase/app'

const config = {
    apiKey: "AIzaSyBvS3ux1S8g6Tleei5BuM4gFGqf3bD9DTA",
    authDomain: "gofor-efc3a.firebaseapp.com",
    databaseURL: "https://gofor-efc3a.firebaseio.com",
    projectId: "gofor-efc3a",
    storageBucket: "gofor-efc3a.appspot.com",
    messagingSenderId: "511800446738",
    appId: "1:511800446738:web:07143ef16eefaedae6adcb",
    measurementId: "G-PEW6164FTH"
};

const fire = firebase.initializeApp(config)

export default fire
