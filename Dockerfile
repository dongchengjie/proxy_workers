FROM node:lts

RUN apt-get update && apt-get -y install p7zip-full

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your action's code
COPY . .

# Run
ENTRYPOINT ["sh", "-c", "node /index.js"]