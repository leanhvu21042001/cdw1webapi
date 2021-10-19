const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/user.controller')
const verifyJWT = require('../../middlewares/verifyJWT');

// @route GET api/v1/users/current
// @desc Get current user.
// @access private
router.get('/current', verifyJWT, UserController.getOneUserByUUID);


module.exports = router;