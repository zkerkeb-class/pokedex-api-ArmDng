import rateLimit from "express-rate-limit";

// Middleware de limitation de taux pour les requêtes API
const apiRateLimiter = rateLimit({
    max: 100, // Limite à 100 requêtes par IP
    message: "Trop de requêtes depuis cette IP, veuillez réessayer plus tard.",
    standardHeaders: true,
    legacyHeaders: false,
});

export default apiRateLimiter;
