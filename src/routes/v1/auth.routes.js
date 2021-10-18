const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/auth.controller');

// endpoint user with auth.

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.get('/refresh', AuthController.refresh_token);

router.get('/logout', AuthController.logout);

module.exports = router;