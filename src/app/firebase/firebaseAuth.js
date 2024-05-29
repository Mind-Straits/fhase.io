import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { app } from "./config";

class FirebaseAuth {
  constructor() {
    this.auth = getAuth(app);
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result.user;
    } catch (error) {
      throw new Error("Error during Google Sign-In: " + error.message);
    }
  }
  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw new Error("Error During logout:" + error.message);
    }
  }
}

const firebaseAuth = new FirebaseAuth();
export default firebaseAuth;
