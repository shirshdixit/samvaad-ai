import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import getOllamaResponse from './utils/ollama.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use("/api/thread", chatRoutes);

app.listen(port, () => {
    console.log("app is listening");
});