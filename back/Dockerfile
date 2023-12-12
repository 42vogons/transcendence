FROM node:lts-alpine

WORKDIR /srcs

COPY ./ ./

RUN npm install

RUN npx prisma migrate dev --name init

RUN npx prisma generate

EXPOSE 3001

ENTRYPOINT ["npm", "run", "start"]
