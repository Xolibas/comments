const Router = require('express');
const router = new Router();
const comments = require("../controllers/commentController.js");

// Create a new Comment
router.post("/", comments.create);

// Retrieve all replies
router.get("/", comments.getAll);

// Retrieve replies of comment
router.get("/:id", comments.getReplies);

module.exports = router;