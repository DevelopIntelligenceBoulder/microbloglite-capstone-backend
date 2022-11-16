const express = require('express');
const router = express.Router();

//middleware used to require authentication
const { validateJwtMiddleware } = require("../auth");

//import the user controller to handle our user routes
const likeController = require("../controllers/like.controller")

//post route to create a post (requires auth)
router.post("/", validateJwtMiddleware, likeController.createLike)

//delete route to delete a specific post (requires auth)
router.delete("/:likeId", validateJwtMiddleware, likeController.deleteLike)

module.exports = router;
