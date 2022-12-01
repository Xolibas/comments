FROM node:16.18.1

WORKDIR /server
COPY package.json .
RUN npm install
COPY . .
CMD npm start