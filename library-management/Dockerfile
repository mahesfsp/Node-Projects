# Use Node base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the files
COPY . .

# Build the project
RUN npm run build

# Expose port and start the app
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
