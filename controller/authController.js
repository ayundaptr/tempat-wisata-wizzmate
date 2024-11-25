const { auth, db } = require("../firebase-config"); // Mengimpor firebase-config yang berisi Firebase Realtime Database (db)
const { createUserWithEmailAndPassword } = require("firebase/auth");
const { signInWithEmailAndPassword } = require("firebase/auth");
const { ref, set } = require("firebase/database"); // Mengimpor fungsi untuk menulis ke Realtime Database

// Fungsi registrasi pengguna
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, Email dan password diperlukan" });
  }

  try {
    // Membuat akun pengguna dengan email dan password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Simpan username ke Realtime Database setelah pendaftaran
    const userRef = ref(db, "users/" + userCredential.user.uid); // Menyimpan berdasarkan UID pengguna
    await set(userRef, {
      email: email,
      username: username,
      uid: userCredential.user.uid,
    });

    res.status(201).json({
      message: "User berhasil didaftarkan",
      user: userCredential.user.uid,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mendaftarkan pengguna", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password diperlukan" });
  }

  try {
    // Login menggunakan email dan password
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Ambil username pengguna dari Realtime Database setelah login
    const userRef = ref(db, "users/" + userCredential.user.uid); // Referensi berdasarkan UID pengguna
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ message: "Data pengguna tidak ditemukan" });
    }

    const userData = snapshot.val(); // Ambil data pengguna dari database

    res.status(200).json({
      message: "Login berhasil",
      user: userCredential.user.uid,
      username: userData.username, // Menambahkan username ke response
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal login", error: error.message });
  }
};
