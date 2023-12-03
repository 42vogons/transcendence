FROM node:latest

WORKDIR /srcs

COPY ./ ./

RUN npm install

EXPOSE 3001

ENTRYPOINT ["npm", "run", "start"]