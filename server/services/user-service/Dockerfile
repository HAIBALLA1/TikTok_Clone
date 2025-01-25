# Utiliser l'image officielle de Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du code source
COPY . ./

# Exposer le port sur lequel l'application va tourner
EXPOSE 3001

# Définir la commande par défaut pour démarrer l'application
CMD ["npm", "start"]
