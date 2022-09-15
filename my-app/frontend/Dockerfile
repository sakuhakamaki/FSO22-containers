FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci --omit=dev

RUN npm install --only=dev

ARG REACT_APP_BACKEND_URL

ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

RUN npm run build


FROM node:16 AS test-stage

WORKDIR /usr/src/app

COPY --from=build-stage /usr/src/app/ .

RUN CI=true npm run test


FROM nginx:1.20-alpine

COPY --from=test-stage /usr/src/app/build /usr/share/nginx/html
