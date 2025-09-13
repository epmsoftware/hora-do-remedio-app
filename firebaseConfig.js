// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getAuth, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Config do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA6iuDKUhFvWfO74FOzXYaBLed7mzm4Ylc",
  authDomain: "hora-do-remedio-app01.firebaseapp.com",
  projectId: "hora-do-remedio-app01",
  storageBucket: "hora-do-remedio-app01.firebasestorage.app",
  messagingSenderId: "1078083283010",
  appId: "1:1078083283010:web:559ca3dacc8a35a1b065db",
  measurementId: "G-RQ2ZW8TKC2"
};

// Inicializa app Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Auth com persistência adequada
let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
  auth.setPersistence(browserLocalPersistence);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Firestore
const db = getFirestore(app);

export { auth, db };