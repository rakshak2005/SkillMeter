// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAuZB2LHFBKnDwyMCPW455-wLaSRVhW73c",
  authDomain: "skillmatric.firebaseapp.com",
  projectId: "skillmatric",
  storageBucket: "skillmatric.firebasestorage.app",
  messagingSenderId: "225343977077",
  appId: "1:225343977077:web:cf46d2441eca082d7f6a3c",
  measurementId: "G-SJM6MRG0KT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Google Provider
export const googleProvider = new GoogleAuthProvider();