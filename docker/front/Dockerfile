FROM node AS build

WORKDIR /app
ARG NODE_REG
RUN npm config set registry ${NODE_REG}

COPY . .

ARG VITE_BACKEND
RUN npm install
RUN npm run build

FROM nginx

COPY --from=build /app/dist /usr/share/nginx/html