FROM node:25-alpine

COPY . /app

WORKDIR /app 

RUN npx pnpm i

CMD [ "node", "--import=tsx", "index.ts" ]