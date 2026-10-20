
import type { Request, Response } from "express";
import connection from "../db/index.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

interface User extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  role: "admin" | "member";
}

export async function register(
  req: Request,
  res: Response
): Promise<void> {
  const { username, password } = req.body ?? {};

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    password.length < 8
  ) {
    res.status(400).json({
      message: "Username wajib diisi dan password minimal 8 karakter",
    });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query<ResultSetHeader>(
      `INSERT INTO users (username, password, role)
       VALUES (?, ?, 'member')`,
      [username.trim(), hashedPassword],
      (err, result) => {
        if (err) {
          console.error("REGISTER MYSQL ERROR:", err.code);

          if (err.code === "ER_DUP_ENTRY") {
            res.status(409).json({
              message: "Username sudah digunakan",
            });
            return;
          }

          res.status(500).json({
            message: "Gagal membuat akun",
          });
          return;
        }

        res.status(201).json({
          message: "Register berhasil",
          id: result.insertId,
        });
      }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
}

export function login(req: Request, res: Response): void {
  const { username, password } = req.body ?? {};

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password
  ) {
    res.status(400).json({
      message: "Username dan password wajib diisi",
    });
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET belum dikonfigurasi");
    res.status(500).json({
      message: "Konfigurasi autentikasi server belum lengkap",
    });
    return;
  }

  connection.query<User[]>(
    "SELECT * FROM users WHERE username = ? LIMIT 1",
    [username.trim()],
    (err, results) => {
      if (err) {
        console.error("LOGIN MYSQL ERROR:", err.code);
        res.status(500).json({
          message: "Gagal mengambil data pengguna",
        });
        return;
      }

      const user = results[0];

      if (!user) {
        res.status(401).json({
          message: "Username atau password salah",
        });
        return;
      }

      void (async () => {
        try {
          const cocok = await bcrypt.compare(password, user.password);

          if (!cocok) {
            res.status(401).json({
              message: "Username atau password salah",
            });
            return;
          }

          const token = jwt.sign(
            {
              id: user.id,
              username: user.username,
              role: user.role,
            },
            secret,
            { expiresIn: "2h" }
          );

          res.status(200).json({
            message: "Login berhasil",
            token,
            user: {
              id: user.id,
              username: user.username,
              role: user.role,
            },
          });
        } catch (error) {
          console.error("LOGIN PROCESS ERROR:", error);
          if (!res.headersSent) {
            res.status(500).json({
              message: "Terjadi kesalahan saat login",
            });
          }
        }
      })();
    }
  );
}
