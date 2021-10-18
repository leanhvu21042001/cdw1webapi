const jwt = require('jsonwebtoken');
require('dotenv').config();
const UserModel = require('../models/user.model');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({
        success: false,
        message: "Invalid token!"
      });

      const userByID = await UserModel.findOneUserByID(decoded?.id);
      if (userByID) {
        req.user = userByID;
        next();
      } else {
        throw new Error("Invalid token");
      }
    })
}

module.exports = verifyJWT;