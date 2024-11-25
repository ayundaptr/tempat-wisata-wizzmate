const express = require("express");
const { auth, db } = require("../firebase-config"); // Mengimpor Firebase Authentication dan Realtime Database
const { createUserWithEmailAndPassword } = require("firebase/auth");
const { signInWithEmailAndPassword } = require("firebase/auth");
const { ref, set, get } = require("firebase/database"); // Mengimpor fungsi untuk bekerja dengan Realtime Database

const router = express.Router(); // Membuat router

// Fungsi registrasi pengguna
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Validasi input
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, Email, dan Password diperlukan" });
  }

  try {
    // 1. Mendaftar pengguna dengan email dan password menggunakan Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 2. Menyimpan data pengguna (termasuk username) ke Firebase Realtime Database
    const userRef = ref(db, "users/" + userCredential.user.uid); // Path berdasarkan UID pengguna
    await set(userRef, {
      email: email,
      username: username,
      uid: userCredential.user.uid,
    });

    // 3. Mengirimkan respons berhasil setelah registrasi
    res.status(201).json({
      message: "User berhasil didaftarkan",
      user: userCredential.user.uid,
      username: username,
    });
  } catch (error) {
    // 4. Menangani error jika terjadi saat registrasi
    console.error(error);
    res
      .status(500)
      .json({ message: "Gagal mendaftarkan pengguna", error: error.message });
  }
});

// Fungsi login pengguna
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan Password diperlukan" });
  }

  try {
    // 1. Login menggunakan email dan password
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 2. Ambil data pengguna dari Realtime Database
    const userRef = ref(db, "users/" + userCredential.user.uid);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ message: "Data pengguna tidak ditemukan" });
    }

    const userData = snapshot.val(); // Ambil data pengguna

    // 3. Kirimkan respons login berhasil beserta username
    res.status(200).json({
      message: "Login berhasil",
      user: userCredential.user.uid,
      username: userData.username,
    });
  } catch (error) {
    // 4. Menangani error jika gagal login
    console.error(error);
    res.status(500).json({ message: "Gagal login", error: error.message });
  }
});

module.exports = router;
