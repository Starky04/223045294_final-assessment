// Auto-generated Firebase initializer
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "apiKey": "AIzaSyArGMds2TkMh6GMgPS7SO8eEDHqCggKp_E",
  "authDomain": "myshoppingapp-fc96b.firebaseapp.com",
  "projectId": "myshoppingapp-fc96b",
  "storageBucket": "myshoppingapp-fc96b.firebasestorage.app",
  "messagingSenderId": "86991869949",
  "appId": "1:86991869949:web:2fbc289edb96a68bef6b94",
  "measurementId": "G-WL3D9R4SQE"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
