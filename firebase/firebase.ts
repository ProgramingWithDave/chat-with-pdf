
import { getApp, getApps, initializeApp,  } from "firebase/app";
import {getFirestore  } from "firebase/firestore";
import {getStorage  } from "firebase/storage";



  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY!,
    authDomain: "chat-with-pdf-e5c46.firebaseapp.com",
    projectId: "chat-with-pdf-e5c46",
    storageBucket: "chat-with-pdf-e5c46.appspot.com",
    messagingSenderId: "887946070395",
    appId: "1:887946070395:web:6901fb6f3335afeaf2d5de"
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

  const db = getFirestore(app)

  const storage = getStorage(app)

  export { db,  storage}