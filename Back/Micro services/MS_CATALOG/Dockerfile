
FROM node:20-alpine

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./src ./src

RUN ls -al

RUN npm install
EXPOSE 4688

CMD ["npm", "start"]