import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Auth Error:", error);
    throw error;
  }
} 