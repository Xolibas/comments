const Router = require('express');
const router = new Router();
const users = require("../controllers/userController.js");

// Create a new User
router.post("/", users.create);

// Retrieve a single User with IP
router.get("/:ip", users.findOneByIp);

module.exports = router;