const db = require('../utils/db');

const TBL_USER = "users";
// const TBL_COL_USER_ID = "id";
const TBL_COL_UUID = "uuid";
const TBL_COL_NAME = "name";
// const TBL_COL_AGE = "age";
const TBL_COL_EMAIL = "email";
const TBL_COL_REFRESH_TOKEN = "refresh_token";
const TBL_COL_HASH_PASSWORD = "hash_password";
// const TBL_COL_IS_ACTIVE = "is_active";

const UserModel = {};

UserModel.addUser = (entity = {}) => db.insert(TBL_USER, entity);

UserModel.deleteUserByUUID = function (uuid) { }

UserModel.updateUserByUUID = (entity, uuid) => {
  return db.update(TBL_USER, entity, { uuid: uuid })
}

UserModel.findOneUserByID = async function (id) {
  const rows = await db.load(`SELECT * FROM ${TBL_USER} WHERE ${TBL_COL_USER_ID} = '${id}';`);
  if (rows.length === 0) { return null }
  return rows[0];
}

UserModel.findOneUserByEmail = async (email) => {
  const rows = await db.load(`SELECT * FROM ${TBL_USER} WHERE ${TBL_COL_EMAIL} = '${email}';`);
  if (rows.length === 0) { return null }
  return rows[0];
}
UserModel.findOneUserByRefreshToken = async (refreshToken) => {
  const rows = await db.load(`SELECT * FROM ${TBL_USER} WHERE ${TBL_COL_REFRESH_TOKEN} = '${refreshToken}';`);
  
  if (rows.length === 0) { return null }
  return rows[0];
}

UserModel.findAllUsers = function () { }

module.exports = UserModel;