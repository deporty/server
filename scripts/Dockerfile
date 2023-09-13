FROM node:16-alpine as builder
WORKDIR usr/src/app
COPY ./servers/$SERVER/dist ./
RUN npm install -P
FROM node:16-alpine
WORKDIR usr/src/app
copy --from=builder ./usr/src/app ./
EXPOSE $PORT
CMD node ./src/index.js