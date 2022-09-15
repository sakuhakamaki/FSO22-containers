FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN NODE_ENV=development npm install

RUN npm install --only=dev

CMD ["npm", "start"]
