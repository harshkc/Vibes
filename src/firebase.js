import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  messagingSenderId: import.meta.env.VITE_FB_MSI,
  appId: import.meta.env.VITE_FB_APP_ID,
  measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID,
  authDomain: "vibes-cf7b4.firebaseapp.com",
  projectId: "vibes-cf7b4",
  storageBucket: "vibes-cf7b4.appspot.com",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);

export {auth, analytics, db};
