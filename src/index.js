import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import pokemonRoutes from "./routes/pokemonRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import apiRateLimiter from "./middleware/rateLimiter.js";
import {protect} from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
const PORT = 3000;

// Lire le fichier JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();
// Middleware pour CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour servir des fichiers statiques
// 'app.use' est utilisé pour ajouter un middleware à notre application Express
// '/assets' est le chemin virtuel où les fichiers seront accessibles
// 'express.static' est un middleware qui sert des fichiers statiques
// 'path.join(__dirname, '../assets')' construit le chemin absolu vers le dossier 'assets'
app.use('/assets', express.static(path.join(__dirname, '../assets')));

app.use(apiRateLimiter);

// Routes
app.use("/api/pokemons", pokemonRoutes);
app.use("/api", authRoutes);



// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur ${process.env.API_URL}`);
});