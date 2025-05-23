import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Générer un token JWT
const generateToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: "30m" });
};

/**
 * Gère l'inscription des utilisateurs
 * @param {Request} req - L'objet request d'Express
 * @param {Response} res - L'objet response d'Express
 */
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
                token: generateToken(user.id, user.username),
            });
        } else {
            res.status(400).json({ message: "Données utilisateur invalides" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Gère la connexion des utilisateurs
 * @param {Request} req - L'objet request d'Express
 * @param {Response} res - L'objet response d'Express
 */
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                username: user.username,
                token: generateToken(user.id, user.username),
            });
        } else {
            res.status(401).json({ message: "Identifiants invalides" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
