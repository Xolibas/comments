FROM node:16.18.1

WORKDIR /server
COPY package.json .
COPY /node_modules .
COPY . .
RUN npm install
CMD npm start