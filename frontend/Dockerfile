FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set API URL for Docker environment - use localhost for browser access
ENV VITE_API_URL=http://localhost:5000/api

RUN npm run build

EXPOSE 3000

CMD ["npm","run","dev","--","--host"]