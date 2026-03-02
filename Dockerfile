FROM node:22-alpine

# set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache mechanisms
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Catch the argument passed from docker-compose.yaml
ARG VITE_BACKEND_API_URL

# Set it as an environment variable so Vite can read it during the build
ENV VITE_BACKEND_API_URL=$VITE_BACKEND_API_URL

# Build the SvelteKit app
RUN npm run build

# Expose the port the app runs on
EXPOSE 4173

# Define the command to run the app
# CMD ["npm", "run", "preview"]
CMD ["node", "build"]