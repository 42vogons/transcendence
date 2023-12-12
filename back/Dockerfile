FROM node:lts-alpine

WORKDIR /srcs

COPY ./ ./

RUN npm install

RUN npm run build

EXPOSE 3001

ENTRYPOINT ["npm", "run", "start"]
