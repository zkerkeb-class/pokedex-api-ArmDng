import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            french: { type: String, required: true },
            english: { type: String, required: true },
            japanese: String,
            chinese: String,
        },
        type: [
            {
                type: String,
                enum: [
                    "Normal",
                    "Fire",
                    "Water",
                    "Grass",
                    "Electric",
                    "Ice",
                    "Fighting",
                    "Poison",
                    "Ground",
                    "Flying",
                    "Psychic",
                    "Bug",
                    "Rock",
                    "Ghost",
                    "Dragon",
                    "Dark",
                    "Steel",
                    "Fairy",
                ],
            },
        ],
        image: {
            type: String,
        },
        base: {
            HP: Number,
            Attack: Number,
            Defense: Number,
            Sp_Attack: Number,
            Sp_Defense: Number,
            Speed: Number,
        },
        evolutions: [
            {
                type: Number,
                ref: "Pokemon",
            },
        ],
    },
    {
        timestamps: true,
    }
);



const Pokemon = mongoose.model("pokemons", pokemonSchema);

export default Pokemon;
