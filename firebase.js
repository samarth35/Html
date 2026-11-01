import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqi2hpDhMsI1X3tjVPXbaHuMLh9mRD8Ao",
  authDomain: "jainzee-dd1d7.firebaseapp.com",
  projectId: "jainzee-dd1d7",
  storageBucket: "jainzee-dd1d7.firebasestorage.app",
  messagingSenderId: "595345456947",
  appId: "1:595345456947:web:a227155aa0e0a09243c846",
  measurementId: "G-QKZB611ZZG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  app,
  auth,
  firebaseConfig,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
};
export default app;
