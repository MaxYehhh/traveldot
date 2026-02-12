import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    UserCredential
} from "firebase/auth";
import { auth } from "./firebase";

export const signUp = async (email: string, password: string): Promise<UserCredential> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('此 Email 已被使用,請使用其他 Email 或登入');
        }
        if (error.code === 'auth/weak-password') {
            throw new Error('密碼強度不足');
        }
        throw error;
    }
};

export const signIn = async (email: string, password: string): Promise<UserCredential> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            throw new Error('帳號或密碼錯誤');
        }
        throw error;
    }
};

export const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
};
