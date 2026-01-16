import {initializeApp, getApps, getApp} from 'firebase/app';
import {firebaseConfig} from './config';

// Initialize Firebase
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
