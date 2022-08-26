
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

if (process.env.NODE_ENV === 'development') {
  console.log('Using emulated firebase functions on localhost:5001');
  connectFunctionsEmulator(functions, "localhost", 5001);
}

export const search = httpsCallable(functions, 'searchMulti');


