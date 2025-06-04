const express = require("express");
const passwordMiddleware = require("../middleware/password");
const router = express.Router();

const userCtrl = require("../controllers/user");

router.post("/signup", passwordMiddleware, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
