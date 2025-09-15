ARG NGINX_VERSION=stable-alpine3.21-slim
FROM node AS build

WORKDIR /app
ARG NODE_REG
RUN npm config set registry ${NODE_REG}

COPY . .

RUN npm install
RUN npm run build

FROM nginx:${NGINX_VERSION}

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./docker/front/default.conf /etc/nginx/conf.d/