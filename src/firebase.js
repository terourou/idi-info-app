import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBrRFU7rNLWUisSOeSm5JjcqY7R-Qm4zig",
  authDomain: "idi-search.firebaseapp.com",
  projectId: "idi-search",
  storageBucket: "idi-search.appspot.com",
  messagingSenderId: "182973146730",
  appId: "1:182973146730:web:b14a213b7357f687a00c13",
  measurementId: "G-BJCDSHLJGS"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const google_provider = new firebase.auth.GoogleAuthProvider();
const fb_provider = new firebase.auth.FacebookAuthProvider();

export { auth, google_provider, fb_provider };
export default db;
