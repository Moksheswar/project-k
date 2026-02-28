// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaiIvYp8e7_4r2YFVlVPEudv7n9-JB-Qg",
  authDomain: "project-k-2004.firebaseapp.com",
  projectId: "project-k-2004",
  storageBucket: "project-k-2004.firebasestorage.app",
  messagingSenderId: "945527069476",
  appId: "1:945527069476:web:cdde45d7e6cb0eb884b1b1",
  measurementId: "G-5VD83CR69D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();