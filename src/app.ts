
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.ts";
import gameRoutes from "./routes/gameRoutes.ts";

const app = express();

app.use(cors({
  origin: "https://aiven-erm2fd7e3-bejoowithu.vercel.app", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({ message: "GameVault API berjalan" });
});

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);

export default app;
