from node

ARG NODE_REG=https://registry.npmjs.org/

WORKDIR /app
RUN npm config set registry ${NODE_REG}

RUN npm install -g json-server

COPY db.json .

CMD ["json-server", "db.json", "--port", "3001"]