import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
