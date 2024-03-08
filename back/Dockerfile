FROM node:lts-alpine

ARG BACK_DOMAIN
ENV BACK_DOMAIN=$BACK_DOMAIN

WORKDIR /srcs

COPY ./ ./

RUN npm install
