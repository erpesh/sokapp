import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "@firebase/firestore";

export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: "sokur-appointment.appspot.com",
  messagingSenderId: "1077229339582",
  appId: "1:1077229339582:web:904d38ad89d85d4c286fef"
};

export const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY
    ? JSON.parse(process.env.NEXT_PUBLIC_PRIVATE_KEY)
    : undefined,
  clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);