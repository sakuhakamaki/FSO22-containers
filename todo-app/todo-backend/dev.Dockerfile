FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci 

ENV DEBUG=playground:*

ENV REDIS_URL="redis://redis:6379"

ENV MONGO_URL="mongodb://the_username:the_password@mongo:27017/the_database"

ENV legacyWatch=true

USER node

CMD npm run dev
