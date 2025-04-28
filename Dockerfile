# Base image - Node.js LTS
FROM node:18-bullseye-slim

# ²Création et définition du répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Copie du reste du code source
COPY . .

# Exposition du port
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=production
ENV DEBUG=express:*

# Commande de démarrage avec meilleure gestion des erreurs
CMD ["node", "src/index.js"]