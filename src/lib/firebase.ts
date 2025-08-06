// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "chitsmart",
  "appId": "1:451855370756:web:1544167a81bec650b04351",
  "storageBucket": "chitsmart.appspot.com",
  "apiKey": "AIzaSyAnaQBZwbvfn5-J2epYq0AuamHAYuXe66g",
  "authDomain": "chitsmart.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "451855370756"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
