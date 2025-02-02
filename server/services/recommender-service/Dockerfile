FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src/routes /app/src/routes


COPY . .

EXPOSE 5000

CMD ["npm", "start"]
