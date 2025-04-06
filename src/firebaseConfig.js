// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCueSVPKlnU6M_czZjJohO-BuVqhK-UQaE",
    authDomain: "zero-waste-grocery.firebaseapp.com",
    projectId: "zero-waste-grocery",
    storageBucket: "zero-waste-grocery.firebasestorage.app",
    messagingSenderId: "747016170991",
    appId: "1:747016170991:web:ec3b0b575878738b191a1a",
    measurementId: "G-7CG3YFN8FL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
