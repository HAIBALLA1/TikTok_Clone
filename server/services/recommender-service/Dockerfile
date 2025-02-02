FROM node:18

WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Exposer le port utilisé par le service
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["npm", "start"]
