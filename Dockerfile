# Use the official Node.js image as the base image
FROM node:12.16.3

# Create a new user named 'app' to run the app as a non-root user
RUN useradd --uid 501 --gid 20 --create-home jaredatron

# Set the working directory inside the container
WORKDIR /app

# Switch to the 'jaredatron' non-root user
USER jaredatron

# # Copy package.json and package-lock.json to the working directory
# COPY --chown=app:app package*.json ./

# # Install the app dependencies
# RUN npm install
