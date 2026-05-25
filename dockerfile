# Build Frontend [dist folder]
# Copy the dist folder to the Backend/public folder

FROM node:22-alpine as frontend-builder

COPY ./Frontend /app

WORKDIR /app

RUN npm install

RUN npm run build

# Build Backend
FROM node:22-alpine

COPY ./Backend /app

WORKDIR /app

RUN npm install

COPY --from=frontend-builder /app/dist /app/public

CMD ["node", "server.js"]