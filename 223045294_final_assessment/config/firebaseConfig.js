import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCutT-M297zNbq_Brnd85K1zHCmK6_7iG0",
  authDomain: "shoppingapp-3d9fe.firebaseapp.com",
  projectId: "shoppingapp-3d9fe",
  storageBucket: "shoppingapp-3d9fe.firebasestorage.app",
  messagingSenderId: "675098187507",
  appId: "1:675098187507:web:541b88fbc893a56b5a8986",
  measurementId: "G-X24BD4MQVT"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);
export default app;
