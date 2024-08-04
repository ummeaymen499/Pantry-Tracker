// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_YSeVodBipg4JCDlzt8dvxG2eyoAFdsc",
  authDomain: "pantry-tracker-e991b.firebaseapp.com",
  projectId: "pantry-tracker-e991b",
  storageBucket: "pantry-tracker-e991b.appspot.com",
  messagingSenderId: "703810156741",
  appId: "1:703810156741:web:d26684912f671fc88958ac",
  measurementId: "G-81GV5ZYPD1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };