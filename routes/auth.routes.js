const express = require('express')
const router = express.Router()
const { validateJwtMiddleware } = require("../auth");

const authController = require("../controllers/auth.controller")

router.post("/login", authController.login)
router.get("/logout", validateJwtMiddleware, authController.logout)

module.exports = router;