FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN NODE_ENV=development npm install

RUN npm install --only=dev

ENV DEBUG=playground:*

USER node

CMD npm run dev
