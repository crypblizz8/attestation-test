FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy service code
COPY index.js ./

EXPOSE 3001

CMD ["npm", "start"]
