import express from "express";
import Pokemon from "../models/Pokemon.js";
import Counter from "../models/Counter.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

// Route pour récupérer les Pokémon avec pagination
router.get("/", protect, async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Page actuelle
    const limit = parseInt(req.query.limit) || 10; // Nombre de Pokémon par page
    const skip = (page - 1) * limit; // Calcul du nombre de documents à ignorer

    try {
        const total = await Pokemon.countDocuments(); // Nombre total de Pokémon
        const pokemons = await Pokemon.find().skip(skip).limit(limit); // Récupération des Pokémon paginés

        res.json({
            total,
            page,
            pages: Math.ceil(total / limit), // Nombre total de pages
            pokemons,
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des Pokémon" });
    }
});

// GET : Récupérer un Pokémon par ID
router.get('/:id', protect, async (req, res) => {
    try {
        const pokemonId = parseInt(req.params.id);
        if (isNaN(pokemonId)) {
            return res.status(400).json({ type: 'error', message: 'ID de Pokémon invalide' });
        }

        const pokemon = await Pokemon.findOne({ id: pokemonId });
        if (!pokemon) {
            return res.status(404).json({ type: 'error', message: 'Pokémon non trouvé' });
        }

        res.status(200).json(pokemon);
    } catch (err) {
        res.status(500).json({ type: 'error', message: 'Erreur serveur', details: err.message });
    }
});

// POST : Ajouter un Pokémon
router.post("/", protect, async (req, res) => {
    try {
        // Auto-incrémentation de l'ID
        let counter = await Counter.findOneAndUpdate(
            { name: "pokemonId" }, // Recherchez un compteur spécifique pour les Pokémon
            { $inc: { seq: 1 } }, // Incrémentez celui ci de 1
            { new: true, upsert: true } // Créez le compteur s'il n'existe pas encore
        );

        const newPokemonData = req.body;

        // Complétez les champs manquants
        if (!newPokemonData.name || !newPokemonData.name.french) {
            return res.status(400).json({ type: "error", message: "Le nom français est requis" });
        }
        if (!newPokemonData.name.english) {
            newPokemonData.name.english = newPokemonData.name.french;
        }

        newPokemonData.id = counter.seq; // Assignez l'ID au compteur

        const newPokemon = new Pokemon(newPokemonData);
        await newPokemon.save();

        res.status(201).json({ message: "Pokémon ajouté avec succès", pokemon: newPokemon });
    } catch (err) {
        res.status(500).json({ type: "error", message: err.message });
    }
});

// PUT : Modifier un Pokémon
router.put('/:id', async (req, res) => {
    try {
        const pokemonId = parseInt(req.params.id);
        if (isNaN(pokemonId)) {
            return res.status(400).json({ type: 'error', message: 'ID de Pokémon invalide' });
        }
        console.log("pre traitement");
        console.log(req.body);

        const updatedPokemon = await Pokemon.findOneAndUpdate({ id: pokemonId }, req.body, { new: true });
        if (!updatedPokemon) {
            return res.status(404).json({ type: 'error', message: 'Pokémon non trouvé' });
        }
        res.status(200).json({ message: 'Pokémon modifié avec succès', pokemon: updatedPokemon });
        console.log(updatedPokemon);
    } catch (err) {
        res.status(500).json({ type: 'error', message: 'Erreur serveur' });
    }
});


// DELETE : Supprimer un Pokémon
router.delete('/:id', protect, async (req, res) => {
    try {
        const pokemonId = parseInt(req.params.id);
        if (isNaN(pokemonId)) {
            return res.status(400).json({ type: 'error', message: 'ID de Pokémon invalide' });
        }

        const deletedPokemon = await Pokemon.findOneAndDelete({ id: pokemonId });
        if (!deletedPokemon) {
            return res.status(404).json({ message: 'Pokémon non trouvé' });
        }
        res.status(200).json({ message: 'Pokémon supprimé avec succès', pokemon: deletedPokemon });
    } catch (err) {
        res.status(500).json({ type: 'error', message: 'Erreur serveur' });
    }
});

export default router;