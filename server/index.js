require('dotenv').config()
const express = require("express");
const cors = require("cors");
const app = express();
const router = require('./app/routes/index');
const fileUpload = require('express-fileupload');
const path = require('path')
const { sequelize } = require("./app/models");

var corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'uploads')))
app.use(fileUpload({
  createParentPath: true
}))
app.use('/api', router);

const PORT = process.env.NODE_DOCKER_PORT || 8080;

const start = async () => {
  try {
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}.`))
  } catch (e) {
    console.log(e)
  }
}

start()