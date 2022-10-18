import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "cookify-80302.firebaseapp.com",
  projectId: "cookify-80302",
  storageBucket: "cookify-80302.appspot.com",
  messagingSenderId: "50045036716",
  appId: "1:50045036716:web:46e3c4994743f64abb5709",
  measurementId: "G-DSW62CBQRW",
};

export const firebaseApp = initializeApp(firebaseConfig);

export const firebaseStorage  = getStorage(firebaseApp);