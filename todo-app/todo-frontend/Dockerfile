FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV REACT_APP_BACKEND_URL="http://localhost:3001"

RUN npm run build


FROM node:16 AS test-stage

WORKDIR /usr/src/app

COPY --from=build-stage /usr/src/app/ .

RUN CI=true npm run test


FROM nginx:1.20-alpine

COPY --from=test-stage /usr/src/app/build /usr/share/nginx/html
