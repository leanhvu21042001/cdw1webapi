const db = require('../utils/db');
const ProjectModel = {};

ProjectModel.getAllProjects = (user_uuid) => {
  return db.load(`SELECT * FROM projects WHERE user_uuid = '${user_uuid}'`);
}

ProjectModel.getOneProject = (user_uuid, project_id) => {
  return db.load(`SELECT * FROM projects WHERE user_uuid = '${user_uuid}' AND id = ${project_id}`);
}

ProjectModel.createNewProject = (entity) => {
  return db.insert('projects', entity);
}

ProjectModel.deleteProject = (user_uuid, project_id) => {
  return db.delete2condition('projects', user_uuid, project_id);
}

ProjectModel.updateProjectFullFields = (entity, project_id, user_uuid) => {
  return db.update2condition('projects', entity, project_id, user_uuid);
}

ProjectModel.updateProjectSomeFields = (entity, project_id, user_uuid) => {
  return db.update2condition('projects', entity, project_id, user_uuid);
}

module.exports = ProjectModel;