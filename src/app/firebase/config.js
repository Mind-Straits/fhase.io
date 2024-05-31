import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBkRUQj76x7R_R-xNGrN0-1qOuq9uIMtLA",
  authDomain: "fhaseio.firebaseapp.com",
  projectId: "fhaseio",
  storageBucket: "fhaseio.appspot.com",
  messagingSenderId: "524296550137",
  appId: "1:524296550137:web:0f43df9e6529267efe5428",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
export { app, auth };
export const storage = getStorage(app);
