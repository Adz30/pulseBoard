// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOAFPA3pvHUfkB75kkk3mwi17pfMw83ZA",
  authDomain: "pulseboard-75e35.firebaseapp.com",
  projectId: "pulseboard-75e35",
  storageBucket: "pulseboard-75e35.firebasestorage.app",
  messagingSenderId: "776421741142",
  appId: "1:776421741142:web:9a6668e6ad9a6a713de1f7",
  measurementId: "G-LHV9H38BNK",
};

// Initialize Firebase safely
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Optional: Initialize Analytics and Firestore
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
