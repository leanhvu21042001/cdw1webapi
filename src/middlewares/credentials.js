const allowedOrigins = require('../config/whitelist');

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    console.log(11111111);
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
}

module.exports = credentials;