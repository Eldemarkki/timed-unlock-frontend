FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ARG API_URL
ENV API_URL=$API_URL

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "build", "-p", "3000"]