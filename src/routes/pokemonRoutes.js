import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import {
    createPokemon,
    deletePokemon,
    getPaginatedPokemons,
    getPokemonById, getPokemonBySearch,
    updatePokemon
} from "../controllers/pokemonController.js";

const router = express.Router();

/**
 * @route   GET /api/pokemons/search
 * @desc    Récupère des Pokémons par recherche de leur noms
 * @access  Privé
 */
router.get('/', protect, getPokemonBySearch);

/**
 * @route   GET /api/pokemons
 * @desc    Récupère les Pokémons par pagination
 * @access  Privé
 */
router.get("/", protect, getPaginatedPokemons);



/**
 * @route   GET /api/pokemons/:id
 * @desc    Récupère un Pokémon par son Id
 * @access  Privé
 */
router.get('/:id', protect, getPokemonById);


/**
 * @route   POST /api/pokemons
 * @desc    Crée un nouveau Pokémon
 * @access  Privé
 */
router.post("/", protect, createPokemon);

/**
 * @route   PUT /api/pokemons/:id
 * @desc    Modifie un Pokémon
 * @access  Privé
 */
router.put('/:id', updatePokemon);


/**
 * @route   DELETE /api/pokemons/:id
 * @desc    Supprime un Pokémon
 * @access  Privé
 */
router.delete('/:id', protect, deletePokemon);

export default router;