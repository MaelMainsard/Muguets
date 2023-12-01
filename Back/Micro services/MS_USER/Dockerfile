# Utilise l'image officielle Node.js 18
FROM node:18-alpine

# Crée un répertoire de travail à l'intérieur du conteneur
WORKDIR /usr/src/app

# Copie les fichiers nécessaires dans le conteneur
COPY ./package.json ./
COPY ./tsConfig.json ./
COPY ./tsconfig.app.json ./
COPY ./src ./src

RUN ls -al

RUN npm install
# Expose le port sur lequel l'application écoute
EXPOSE 4686

# Commande pour démarrer l'application
CMD ["npm", "start"]