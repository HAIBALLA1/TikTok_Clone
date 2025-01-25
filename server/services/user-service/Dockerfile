FROM node:18

#create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install


COPY ./src ./src


EXPOSE 3001

# Start application
CMD ["node", "src/index.js"]