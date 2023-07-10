import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  //defining config. This info points to web app that we created on Firebase
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig); //creates and initializes instance of Firebase web app. Use this to access services like our Firestore db
const auth = getAuth(app); //getAuth returns Auth instance associated with fb app. Save to var called auth.
const db = getFirestore(app); //Returns Firestore instance associated with app.

export { db, auth }; //Export db and auth for use elsewhere 
