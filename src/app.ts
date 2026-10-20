import 'dotenv/config';
import cors from "cors";
import express from 'express';
import authRoutes from './routes/authRoutes.ts';
import gameRoutes from './routes/gameRoutes.ts';
import './db/index.ts';

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


app.get('/', (req, res) => {
    res.json({
        message: 'API berjalan'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

const PORT = Number(process.env.PORT) || 9669;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});