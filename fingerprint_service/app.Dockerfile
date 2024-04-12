FROM node:20.10.0
RUN mkdir -p /usr/src/app
WORKDIR /usr/src
COPY .npmrc ./
COPY /app/package*.json ./
COPY /app/yarn.lock ./
RUN yarn install
WORKDIR /usr/src/app
COPY /app ./
