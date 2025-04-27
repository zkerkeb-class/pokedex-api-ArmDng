import Pokemon from "../models/Pokemon.js";
import {protect} from "../middleware/authMiddleware.js";
import Counter from "../models/Counter.js";
import router from "../routes/pokemonRoutes.js";

/**
 * Récupère tous les Pokémons
 * @param {Request} req - L'objet request d'Express
 * @param {Response} res - L'objet response d'Express
 */
export const getPaginatedPokemons = async (req, res) => {
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
        res.status(500).json({ message: "Erreur lors de la récupération des Pokémon." });
    }
}

/**
 * Récupère un Pokémon par son ID
 * @param {Request} req - L'objet request d'Express
 * @param {Response} res - L'objet response d'Express
 */
export const getPokemonById = async (req, res) => {
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
}

/**
 * Recherche des Pokémons par nom ou / et type
 * @param {Request} req - L'objet request d'Express
 * @param {Response} res - L'objet response d'Express
 */
export const getPokemonBySearch = async (req, res) => {
    try {
        const searchTerm = req.query.search;
        const typeTerm = req.query.types;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const regex = new RegExp(searchTerm, 'i');

        let query = {
            $or: [
                { "name.french": regex },
                { "name.english": regex }
            ]
        };

        if (typeTerm) {
            query.type = { $in: [typeTerm] };
        }

        const total = await Pokemon.countDocuments(query);
        const pokemons = await Pokemon.find(query).skip(skip).limit(limit);

        res.json({
            total,
            page,
            pages: Math.ceil(total / limit),
            pokemons,
        });
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Erreur lors de la recherche des Pokémon', details: error.message });
    }
};

/**
 * Crée un nouveau Pokémon
 * @param {Request} req - L'objet request d'Express
 * @param {Response} res - L'objet response d'Express
 */
export const createPokemon = async (req, res) => {
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
}

/**
 * Met à jour un Pokémon existant
 * @param {Request} req - L'objet request d'Express
 * @param {Response} res - L'objet response d'Express
 */
export const updatePokemon = async (req, res) => {
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
}

/**
 * Supprime un Pokémon
 * @param {Request} req - L'objet request d'Express
 * @param {Response} res - L'objet response d'Express
 */
export const deletePokemon = async (req, res) => {
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
}