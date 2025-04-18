import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { configDotenv } from "dotenv";

configDotenv();

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);