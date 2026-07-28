FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy server application code
COPY . .

# Create directory for SQLite database
RUN mkdir -p data

EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

CMD ["node", "src/index.js"]
