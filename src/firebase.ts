
import firebaseConfig from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
//import { getStorage, ref } from "firebase/storage";
//import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { connectFunctionsEmulator } from "firebase/functions";

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const functions = getFunctions(app, "europe-west1")

// Don't include when pushing
// connectFunctionsEmulator(functions, "localhost", 5001);

export const addMessage = httpsCallable(functions, 'addMessage');


