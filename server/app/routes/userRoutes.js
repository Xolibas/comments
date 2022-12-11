const Router = require('express');
const router = new Router();
const users = require("../controllers/userController.js");

// Retrieve a single User with IP
router.get("/:ip", users.findOneByIp);

module.exports = router;