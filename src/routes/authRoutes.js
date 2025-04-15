import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

/**
 * @route   POST /api/register
 * @desc    Crée un utilisateur
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/login
 * @desc    Authentifie un utilisateur
 * @access  Public
 */
router.post("/login", loginUser);

export default router;
