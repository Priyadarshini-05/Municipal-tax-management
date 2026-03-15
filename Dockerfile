# Use Node base image
FROM node:18

# Create working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Expose backend port
EXPOSE 5000

# Run the application
CMD ["npm", "start"]
