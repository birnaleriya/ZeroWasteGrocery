import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD8PjzM3mUAz67jox6lKiqaS2MyGCWZoxQ",
    authDomain: "zero-waste-grocery-planner.firebaseapp.com",
    projectId: "zero-waste-grocery-planner",
    storageBucket: "zero-waste-grocery-planner.firebasestorage.app",
    messagingSenderId: "921895411374",
    appId: "1:921895411374:web:26e39222eb7e049b64973f",
    measurementId: "G-7VEY2RFCQB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);