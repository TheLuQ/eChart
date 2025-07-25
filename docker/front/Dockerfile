FROM node AS build

ARG NODE_REG=https://registry.npmjs.org/
WORKDIR /app
RUN npm config set registry ${NODE_REG}

COPY . .

ARG VITE_BACKEND
RUN npm install
RUN npm run build

FROM nginx

COPY --from=build /app/dist /usr/share/nginx/html