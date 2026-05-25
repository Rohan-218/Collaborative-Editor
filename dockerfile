FROM node:22-alpine

COPY ./Backend .

RUN npm install

CMD ["node", "server.js"]