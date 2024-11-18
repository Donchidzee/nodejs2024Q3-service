# Use the official Node.js 22.x.x Alpine image
FROM node:22-alpine

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port that the app runs on
EXPOSE 4000

# Start the application
CMD ["npm", "run", "start:prod"]
