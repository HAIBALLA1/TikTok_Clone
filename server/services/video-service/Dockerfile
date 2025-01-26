# Utiliser l'image officielle de Node.js comme base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le contenu du projet dans le répertoire de travail
COPY . .

# Exposer le port utilisé par le service
EXPOSE 3002

# Définir la commande pour démarrer le service
CMD ["node", "src/index.js"]
