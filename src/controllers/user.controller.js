const UserController = {}
const UserModel = require('../models/user.model')


// UserController.addUser = function (req, res, next) { }

UserController.getOneUserByUUID = async function (req, res) {

  // get uuid from params
  const uuid = req.user.uuid;

  // fetch user from database with uuid
  const userByUUID = await UserModel.findOneUserByUUID(uuid);

  // check user is not null
  if (!userByUUID) {

    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  // delete some secure info
  delete userByUUID.refresh_token;
  delete userByUUID.hash_password;

  return res.json({
    success: true,
    message: "Found one user",
    data: userByUUID,
  });
}

module.exports = UserController;