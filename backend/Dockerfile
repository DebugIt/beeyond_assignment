# Use lightweight Node.js image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose backend port
EXPOSE 5555

# Set environment variables (can also come from docker-compose)
ENV NODE_ENV=production

# Start your backend server
CMD ["node", "server.js"]
