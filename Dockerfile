FROM node:18-alpine

RUN apk add --no-cache --virtual .build-deps \
    curl \
    unzip \
    bash \
    && curl -fsSL https://bun.sh/install | bash \
    && cp /root/.bun/bin/bun /usr/local/bin/bun \
    && apk del .build-deps

WORKDIR /usr/src/app

COPY package.json bun.lock ./
COPY tsconfig.json ./

RUN npm install
RUN npm install -g ts-node typescript

RUN bun install

COPY . .

RUN bun run build

EXPOSE 8080

CMD ["bun", "run", "dev"]