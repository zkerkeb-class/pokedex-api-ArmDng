import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Générer un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// Inscription
export const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: "Utilisateur déjà existant" });
        }

        const user = await User.create({ username, password });

        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: "Données utilisateur invalides" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Connexion
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                username: user.username,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: "Identifiants invalides" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
