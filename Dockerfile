# Use official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /usr/src/app

# Copy only package.json and lock file first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Now copy rest of the application code
COPY . .

# Start the application
CMD ["npm", "start"]