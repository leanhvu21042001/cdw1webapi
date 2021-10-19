const express = require('express');
const router = express.Router();

const users = require('./users.routes');
const auth = require('./auth.routes');

// route v1
router.use("/auth", auth);

router.use("/users", users);

module.exports = router;