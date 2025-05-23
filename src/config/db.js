import mongoose from 'mongoose';

/**
 * Gère la connexion à la BDD MongoDB
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, { authSource: "admin" });
        console.log(`MongoDB connecté: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Erreur de connexion à MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;