import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware pour protéger les routes en vérifiant le token JWT
 * @param {Request} req - L'objet request d'Express
 * @param {Response} res - L'objet response d'Express
 * @param {NextFunction} next - Fonction pour passer au middleware suivant
 */
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(401).json({ message: "Non autorisé, token invalide" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Non autorisé, aucun token fourni" });
    }
};
