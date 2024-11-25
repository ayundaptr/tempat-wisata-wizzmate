// firebase-config.js
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getDatabase } = require("firebase/database");

// Konfigurasi Firebase Anda, pastikan Anda mengganti ini dengan data Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyA0qW_TOwpOHKKo4wJqmT34SrxZn7zo_1s",
  authDomain: "your-auth-domain",
  databaseURL: "firebase.google.com",
  projectId: "capstone-backend-1cfba",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Mendapatkan instansi Auth dan Database
const auth = getAuth(app);
const db = getDatabase(app);

module.exports = { auth, db };
