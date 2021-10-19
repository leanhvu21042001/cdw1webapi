const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/auth.controller');

// @route GET api/v1/auth/register
// @desc Get current user.
// @access public
router.post('/register', AuthController.register);

// @route GET api/v1/auth/login
// @desc Get current user.
// @access public
router.post('/login', AuthController.login);

// @route GET api/v1/auth/refresh
// @desc Get current user.
// @access public
router.get('/refresh', AuthController.refresh_token);

// @route GET api/v1/auth/logout
// @desc Get current user.
// @access public
router.get('/logout', AuthController.logout);

module.exports = router;