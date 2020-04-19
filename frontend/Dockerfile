FROM node:13.13.0 as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM nginx:1.17.10-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html