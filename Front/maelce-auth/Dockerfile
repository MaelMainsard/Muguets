# Utilise l'image officielle Node.js 18
FROM node:18-alpine

# Crée un répertoire de travail à l'intérieur du conteneur
WORKDIR /usr/src/app

# Copie les fichiers nécessaires dans le conteneur
COPY ./assets ./assets
COPY ./components ./components
COPY ./pages ./pages
COPY ./public ./public
COPY ./server ./server
COPY ./nuxt.config.ts ./
COPY ./package.json ./
COPY ./tailwind.config.js ./
COPY ./tsconfig.json ./
COPY ./.nuxt ./.nuxt

RUN ls -al

RUN npm install

RUN npm run build

# Expose le port sur lequel l'application écoute
EXPOSE 4690

CMD ["npm","run","preview"]