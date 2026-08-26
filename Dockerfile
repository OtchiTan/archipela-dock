FROM node:alpine AS builder

ENV NODE_ENV development

WORKDIR /react-app

COPY ./package*.json /react-app

RUN npm install

COPY . .

CMD ["npm","run", "build"]

FROM nginx:1.31.4-alpine as nginx

COPY --from=builder /react-app/dist /usr/share/nginx/html