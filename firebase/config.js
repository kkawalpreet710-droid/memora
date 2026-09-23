// Get these values from: Firebase console -> Project settings -> General -> Your apps -> SDK setup
// This is safe to commit for a hackathon prototype (these are not secret keys,
// access is controlled by Firestore security rules, not by hiding this config).

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "process.env.EXPO_PUBLIC_FIREBASE_API_KEY",
  authDomain: "cognicare-hackathon.firebaseapp.com",
  projectId: "cognicare-hackathon",
  storageBucket: "cognicare-hackathon.firebasestorage.app",
  messagingSenderId: "705037328172",
  appId: "1:705037328172:web:b56a74c38ae55132859689"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
