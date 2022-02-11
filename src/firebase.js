import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBLx44pTaoI5SGl-5fYsmgqfCbAXDx0Po",
  authDomain: "boosted-3b543.firebaseapp.com",
  projectId: "boosted-3b543",
  storageBucket: "boosted-3b543.appspot.com",
  messagingSenderId: "444780229691",
  appId: "1:444780229691:web:42b693f40c0e9df409d81e",
  measurementId: "G-JBV1KT5P4E",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);

export {auth, analytics, db};
