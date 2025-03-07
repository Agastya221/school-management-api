FROM node:20-slim


# Install OpenSSL 1.1 and other necessary libraries
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*
# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production


# Copy the rest of the app
COPY . .

#generate Prisma client
RUN npx prisma generate

# Build the app
RUN npm run build

EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
