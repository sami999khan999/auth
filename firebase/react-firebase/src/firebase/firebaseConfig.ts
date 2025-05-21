// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAX669fBDYsdDw3sOqIZsBN6-QXUeefcOk",
  authDomain: "test-66d41.firebaseapp.com",
  projectId: "test-66d41",
  storageBucket: "test-66d41.appspot.com",
  messagingSenderId: "408226894647",
  appId: "1:408226894647:web:3d1fae37c9504aafda40b2",
  measurementId: "G-0SSXJBGL7W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
