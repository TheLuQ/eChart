FROM node AS build

WORKDIR /app
ARG NODE_REG
RUN npm config set registry ${NODE_REG}

COPY . .

ARG VITE_BACKEND
RUN npm install
RUN npm run build

FROM nginx:stable-alpine3.21-slim

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./docker/front/default.conf /etc/nginx/conf.d/