const express = require('express');
const router = express.Router();

//middleware used to require authentication
const { validateJwtMiddleware } = require("../auth");

//import the user controller to handle our user routes
const postController = require("../controllers/post.controller")

//post route to create a post (requires auth)
router.post("/", validateJwtMiddleware, postController.createPost)

//get route to return all posts (requires auth)
router.get("/", validateJwtMiddleware, postController.getPosts)

//get route to return a specific post (requires auth)
router.get("/:postId", validateJwtMiddleware, postController.getPost)

//delete route to delete a specific post (requires auth)
router.delete("/:postId", validateJwtMiddleware, postController.deletePost)

module.exports = router;
