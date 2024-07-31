# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml files to the working directory
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install project dependencies
RUN pnpm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the ports that the Next.js server and Socket.IO server will run on
EXPOSE 3000
EXPOSE 4000

# Default command
CMD ["pnpm", "run", "dev"]
