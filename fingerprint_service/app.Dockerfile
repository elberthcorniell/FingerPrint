FROM node:20.10.0
RUN mkdir -p /usr/src/app
WORKDIR /usr/src
COPY .npmrc ./
COPY /app ./
RUN yarn install
WORKDIR /usr/src/app
