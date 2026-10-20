
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.ts";
import gameRoutes from "./routes/gameRoutes.ts";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://aiven-np.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({ message: "GameVault API berjalan" });
});

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);

export default app;
