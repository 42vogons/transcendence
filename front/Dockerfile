FROM node:latest

ARG FRONT_DOMAIN
ENV FRONT_DOMAIN=$FRONT_DOMAIN

WORKDIR /srcs

COPY ./ ./

RUN npm install

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "start"]