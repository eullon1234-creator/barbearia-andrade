import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyC8vF3TOaknIMMrlBM4VJcnbO7fV_geUcM",
  authDomain: "barbearia-andrade-fc286.firebaseapp.com",
  projectId: "barbearia-andrade-fc286",
  storageBucket: "barbearia-andrade-fc286.firebasestorage.app",
  messagingSenderId: "588038561420",
  appId: "1:588038561420:web:ab74b864db427dfa86a5a9",
  measurementId: "G-G4YJZP26MM"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore Database
export const db = getFirestore(app);

export default app;
