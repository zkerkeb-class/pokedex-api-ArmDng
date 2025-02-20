import express from "express";
import cors from "cors";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// Lire le fichier JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'data', 'pokemons.json');
const pokemonsList = JSON.parse(fs.readFileSync(path.join(__dirname, './data/pokemons.json'), 'utf8'));

const app = express();
const PORT = 3000;

// Middleware pour CORS
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour servir des fichiers statiques
// 'app.use' est utilisé pour ajouter un middleware à notre application Express
// '/assets' est le chemin virtuel où les fichiers seront accessibles
// 'express.static' est un middleware qui sert des fichiers statiques
// 'path.join(__dirname, '../assets')' construit le chemin absolu vers le dossier 'assets'
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Route GET de base
app.get("/api/pokemons", (req, res) => {
    res.status(200).send({
        types: [
            "fire",
            "water",
            "grass",
            "electric",
            "ice",
            "fighting",
            "poison",
            "ground",
            "flying",
            "psychic",
            "bug",
            "rock",
            "ghost",
            "dragon",
            "dark",
            "steel",
            "fairy",
        ],
        pokemons: pokemonsList,
    });
});

app.get("/", (req, res) => {
    res.send("bienvenue sur l'API Pokémon");
});


app.get('/api/pokemons', (req, res) => {
    res.status(200).send(pokemonsList);
});

app.get('/api/pokemons/:id', (req, res) => {
    const pokemon = pokemonsList.find(pokemon => pokemon.id === parseInt(req.params.id));
    res.status(200).json(pokemon);
})

app.post('/api/pokemons', (req, res) => {
    const newPokemon = req.body;

    const newId = pokemonsList.length > 0
        ? Math.max(...pokemonsList.map(p => p.id)) + 1
        : 1;

    const pokemonToAdd = {
        id: newId,
        ...newPokemon
    };

    pokemonsList.push(pokemonToAdd);
    fs.writeFileSync(filePath, JSON.stringify(pokemonsList, null, 2), 'utf-8');

    res.status(201).json({
        message: 'Pokémon ajouté avec succès',
        pokemon: pokemonToAdd
    });
});


app.put('/api/pokemons/:id', (req, res) => {
    const pokemonId = parseInt(req.params.id);
    const updatedData = req.body;

    const pokemonIndex = pokemonsList.findIndex(p => p.id === pokemonId);

    if (pokemonIndex === -1) {
        return res.status(404).json({ message: 'Pokémon non trouvé' });
    }

    if (updatedData.id && updatedData.id !== pokemonId) {
        const idExists = pokemonsList.some(p => p.id === updatedData.id);
        if (idExists) {
            return res.status(409).json({ message: 'ID déjà utilisé par un autre Pokémon' });
        }
    }

    const updatedPokemon = {
        ...pokemonsList[pokemonIndex],
        ...updatedData,
        id: updatedData.id || pokemonId // Garder l'ID original si non fourni
    };

    pokemonsList[pokemonIndex] = updatedPokemon;
    fs.writeFileSync(filePath, JSON.stringify(pokemonsList, null, 2), 'utf-8');

    res.status(200).json({
        message: 'Pokémon modifié avec succès',
        pokemon: updatedPokemon
    });
});


app.delete('/api/pokemons/:id', (req, res) => {
    const pokemonId = parseInt(req.params.id);

    const pokemonIndex = pokemonsList.findIndex(p => p.id === pokemonId);

    if (pokemonIndex === -1) {
        return res.status(404).json({ message: 'Pokémon non trouvé' });
    }

    const [deletedPokemon] = pokemonsList.splice(pokemonIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(pokemonsList, null, 2), 'utf-8');

    res.status(200).json({
        message: 'Pokémon supprimé avec succès',
        pokemon: deletedPokemon
    });
});


// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});