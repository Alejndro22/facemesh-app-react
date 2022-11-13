import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCRnOB7A4Ba738fcvA0r8-3x6ryk6wENzY",
  authDomain: "produccion-operaciones.firebaseapp.com",
  projectId: "produccion-operaciones",
  storageBucket: "produccion-operaciones.appspot.com",
  messagingSenderId: "289283974693",
  appId: "1:289283974693:web:7216dfcb8037bc5e5e81cc",
  measurementId: "G-JQPZ0689FG",
};

// Iniciar Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
