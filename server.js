const express = require("express");
const cors = require("cors"); // Optional: untuk menangani CORS jika frontend berada di domain/port berbeda
const authRoutes = require("./routes/authRoutes"); // Mengimpor authRoutes

const app = express();
const PORT = process.env.PORT || 3000; // Menggunakan environment variable jika ada

// Middleware
app.use(cors()); // Untuk menangani CORS jika frontend dari domain berbeda
app.use(express.json()); // Middleware untuk parsing JSON (sejak Express 4.16+)

// Gunakan routes
app.use("/api/auth", authRoutes); // Menambahkan prefix "/api/auth" untuk routing auth

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
