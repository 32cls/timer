FROM node:25-alpine

COPY . /app

WORKDIR /app 

RUN apk add ffmpeg
RUN npx pnpm i

CMD [ "node", "--import=tsx", "index.ts" ]