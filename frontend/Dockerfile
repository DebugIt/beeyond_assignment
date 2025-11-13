FROM node:20-alpine AS builder


# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the frontend source code
COPY . .

# Build Next.js app
RUN npm run build

# Stage 2 — Production Stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app ./

# Expose port for the Next.js server
EXPOSE 3000

# Start Next.js server
CMD ["npm", "start"]
