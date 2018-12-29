FROM node:8

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY ./ ./

EXPOSE 80

ENTRYPOINT yarn start
