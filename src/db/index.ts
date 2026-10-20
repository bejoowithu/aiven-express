import "dotenv/config";
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 9669),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

connection.connect((err) => {
  if (err) {
    console.error("Koneksi database gagal:", err.message);
    return;
  }

  console.log("Database berhasil terhubung!");
});

export default connection;