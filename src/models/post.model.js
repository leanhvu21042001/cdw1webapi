const db = require('../utils/db');

const TBL_POSTS = 'posts';
const TBL_COL_ID = "id";
const TBL_COL_USER_ID = "user_id";
const TBL_COL_TITLE = "title";
const TBL_COL_CONTENT = "content";
// const TBL_COL_IMAGE_STRING = "image_string";
const TBL_COL_LIKES = "likes";
const TBL_COL_CREATED_AT = "created_at";
const TBL_COL_UPDATED_AT = "updated_at";

const PostModel = {};

PostModel.addPost = (entity = {}) => db.insert(TBL_POSTS, entity);


PostModel.updatePostByUserIDAndPostID = (entity, user_id, post_id) => {

  return db.update2condition(TBL_POSTS, entity, { user_id: user_id }, { id: post_id });
}

PostModel.findOnePostByUserIDAndPostID = async function (user_id, post_id) {
  const rows = await db.load(`SELECT * FROM ${TBL_POSTS} WHERE ${TBL_COL_USER_ID} = '${user_id}' AND ${TBL_COL_ID} = '${post_id}';`);
  if (rows.length === 0) { return null }
  return rows[0];
}

PostModel.getOnePostById = function () { }

PostModel.deleteOnePostByIDAndUserID = function (user_id, post_id) {
  return db.delete2condition(user_id, post_id);
}

PostModel.getAllPosts = async function () {
  const rows = await db.load(`SELECT * FROM ${TBL_POSTS}`);
  if (rows.length === 0) { return null }
  return rows;
}

module.exports = PostModel;