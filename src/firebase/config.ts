import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH_1-CnzDCU2jFH82Js3z73-hh571pHUA",
  authDomain: "english-membership.firebaseapp.com",
  projectId: "english-membership",
  storageBucket: "english-membership.appspot.com",
  messagingSenderId: "195921651761",
  appId: "1:195921651761:web:d31085020bfea689a88d10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 