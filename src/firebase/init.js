// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';
const firebaseToken = import.meta.env.VITE_FIREBASE_TOKEN;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: firebaseToken,
  authDomain: "vera-souvenirs.firebaseapp.com",
  projectId: "vera-souvenirs",
  storageBucket: "vera-souvenirs.appspot.com",
  messagingSenderId: "830799424830",
  appId: "1:830799424830:web:00b2d7e900fc9f1e8e906f",
  measurementId: "G-03LEXKGLBK",
  storageBucket: 'gs://vera-souvenirs.appspot.com'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage(app);
const auth = getAuth();

// init firebase
export { app, db, storage, auth };