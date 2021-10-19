const UserModel = require('../models/user.model');

const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');
const { validateEmail } = require('../validation/validateEmail');
const { saltRounds } = require('../config/bcryptConfig');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const AuthController = {};


AuthController.register = async (req, res, next) => {

  const { name, email, password } = req.body;

  if (String(name).length === 0) {
    return res.status(400).json({ success: false, message: "Name is empty!" });
  }


  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email address!" });
  }

  if (String(password).length === 0) {
    return res.status(400).json({ success: false, message: "Password is empty!" });
  }

  // check for duplicate email in database.
  const duplicate = await UserModel.findOneUserByEmail(email);

  if (duplicate) {
    return res.status(409).json({ success: false, message: "Email is already in use!" });
  }

  try {
    const _uuid = uuid().toString();
    // encrypt the password
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    // new user.
    const newUser = {
      uuid: _uuid
      , name: name
      , email: email
      , hash_password: hashPassword
    }

    await UserModel.addUser(newUser);

    return res.status(201).json({ success: true, message: `New user '${name}' created` })
  } catch (error) {
    return res.status(500).json({ success: true, message: error.message })
  }
}

AuthController.login = async (req, res, next) => {
  const { email, password } = req.body;

  // check is email invalid
  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email address!" });
  }

  // check is empty!"
  if (String(password).length === 0) {
    return res.status(400).json({ success: false, message: "Password is empty!" });
  }

  // check for duplicate email in database.
  const userByEmail = await UserModel.findOneUserByEmail(email);

  // check is user existing in database.
  if (userByEmail === null) {
    return res.status(401).json({ success: false, message: `Please register before login!` });
  }

  // compare client password with from database
  const match = bcrypt.compareSync(password, userByEmail['hash_password']);

  // check is password compare success.
  if (match) {
    const _uuid = userByEmail.uuid;
    const _name = userByEmail.name;
    const _email = userByEmail.email;

    // create JWTs
    const accessToken = jwt.sign(
      {
        uuid: _uuid,
        name: _name,
        email: _email
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    const refreshToken = jwt.sign(
      {
        uuid: _uuid,
        name: _name,
        email: _email
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' }
    );

    // save refresh_token into the database with current user.
    await UserModel.updateUserByUUID({ refresh_token: refreshToken }, userByEmail['uuid']);
    res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 * 30 });

    return res.json({
      success: true, message: "Login successfully!", accessToken, data: {
        uuid: _uuid,
        name: _name,
        email: _email
      }
    });
  } else {
    return res.status(401).json({ success: true, message: `Can't login!` });
  }
}

AuthController.refresh_token = async (req, res, next) => {

  // get cookies from request.
  const cookies = req.cookies;

  // check is existing jwt or empty.
  if (!cookies?.jwt) {
    return res.status(401).json({ success: false, message: "Refresh token is empty!" });
  }
  // get user by refresh token
  const refreshToken = cookies.jwt;
  const userByRefreshToken = await UserModel.findOneUserByRefreshToken(refreshToken);

  // check is user valid.
  if (!userByRefreshToken) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || userByRefreshToken['email'] !== decoded.email) {
        return res.sendStatus(403);
      }
      const _uuid = userByRefreshToken.uuid;
      const _name = userByRefreshToken.name;
      const _email = userByRefreshToken.email;
      const accessToken = jwt.sign(
        {
          uuid: _uuid,
          name: _name,
          email: _email
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
      )
      return res.json({ success: true, message: "Authenticated", accessToken });
    }
  )


}

AuthController.logout = async (req, res, next) => {

  const cookies = req.cookies;

  // check is email invalid
  if (!cookies?.jwt) {
    return res.status(204).json({ success: false, message: "Can't logout!" });
  }

  // get user by refresh token
  const refreshToken = cookies.jwt;
  const userByRefreshToken = await UserModel.findOneUserByRefreshToken(refreshToken);

  // check is user valid.
  if (!userByRefreshToken) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: "None", secure: true });
    return res.status(403).json({ success: true, message: "You have logout after that!" });
  }

  // delete refresh_token in database.
  await UserModel.updateUserByUUID({ refresh_token: '' }, userByRefreshToken['uuid']);

  res.clearCookie('jwt', { httpOnly: true, sameSite: "None", secure: true, });

  return res.status(204);
}

module.exports = AuthController;