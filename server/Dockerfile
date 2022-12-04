FROM node:16.18.1

WORKDIR /server
COPY package.json .
RUN npm install
RUN npm install -g sequelize-cli
COPY . .
CMD npm start