// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOyyVCD4_HC3e5OS_1Cp_5L1Oo3_irNZM",
  authDomain: "geo-attend-27455.firebaseapp.com",
  projectId: "geo-attend-27455",
  storageBucket: "geo-attend-27455.firebasestorage.app",
  messagingSenderId: "761489540683",
  appId: "1:761489540683:web:fec3ecd1f65dca95e9afce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };