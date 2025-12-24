FROM node:25-alpine

COPY . /app

WORKDIR /app 

RUN apk add ffmpeg
RUN npx pnpm install --frozen-lockfile

CMD [ "node", "--import=tsx", "index.ts" ]