const express = require('express');
const router = express.Router();

//middleware used to require authentication
const { validateJwtMiddleware } = require("../auth");

//import the user controller to handle our user routes
const userController = require("../controllers/user.controller")

//post route to create a user (user registration)
router.post("/", userController.createUser)

//get route to return all users (requires auth)
router.get("/", validateJwtMiddleware, userController.getUsers)

//get route to return a specific users (requires auth)
router.get("/:username", validateJwtMiddleware, userController.getUser)

//put route to update a user (requires auth)
router.put("/:username", validateJwtMiddleware, userController.updateUser)

module.exports = router;
