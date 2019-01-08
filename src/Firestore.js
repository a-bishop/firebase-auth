import firebase from "firebase";
import { KEY } from "./apikey"

// Initialize Firebase
const config = {
  apiKey: KEY,
  authDomain: "firestore-tutorial-1cd4d.firebaseapp.com",
  databaseURL: "https://firestore-tutorial-1cd4d.firebaseio.com",
  projectId: "firestore-tutorial-1cd4d",
  storageBucket: "firestore-tutorial-1cd4d.appspot.com",
  messagingSenderId: "298214887470"
};
firebase.initializeApp(config);

export default firebase;
