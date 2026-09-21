ARG NGINX_VERSION=nginx:1.28.0
ARG NODE_VERSION=node:22
FROM ${NODE_VERSION} AS build

WORKDIR /app

COPY *.npmrc /root/
COPY package*.json ./
RUN npm install

COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src
COPY db.json .

RUN npm run build

FROM ${NGINX_VERSION}

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./default.conf /etc/nginx/templates/default.conf.template