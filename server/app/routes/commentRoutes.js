const Router = require('express');
const router = new Router();
const comments = require("../controllers/commentController.js");

// Create a new Comment
router.post("/", comments.create);

// Retrieve all replays
router.get("/", comments.getAll);

// Retrieve replays of comment
router.get("/:id", comments.getReplays);

module.exports = router;