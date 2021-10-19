const ProjectController = {}
const ProjectModel = require('../models/project.model');
const UserModel = require('../models/user.model');


ProjectController.getAllProjects = async (req, res) => {
  try {
    const allProjects = await ProjectModel.getAllProjects(req.user.uuid);
    return res.json({
      mgs: "get all project",
      data: allProjects
    });
  } catch (err) {
    return res.sendStatus(403);
  }
}

ProjectController.getOneProject = async (req, res) => {
  try {
    const { uuid: user_uuid } = req.user;
    const project_id = req.params._id;

    const singleProject = await ProjectModel.getOneProject(user_uuid, Number(project_id))
    return res.json({
      mgs: "get one project with id = " + req.params._id,
      data: singleProject
    });
  } catch (err) {
    return res.sendStatus(403);
  }
}

ProjectController.createNewProject = async (req, res) => {
  try {
    const { uuid: user_uuid } = req.user;
    const getUserByUUID = await UserModel.findOneUserByUUID(user_uuid);
    if (getUserByUUID === null) {
      return res.status(404).json({
        success: false,
        mgs: "Can not create project with user id = " + user_uuid
      });
    }
    req.body.user_uuid = getUserByUUID.uuid
    await ProjectModel.createNewProject(req.body);
    return res.json({
      mgs: "create new project",
      data: req.body,
    });
  } catch (err) {
    return res.sendStatus(403);
  }

}

ProjectController.deleteProject = async (req, res) => {
  try {
    const { uuid: user_uuid } = req.user;
    const singleProject = await ProjectModel.getOneProject(user_uuid, Number(project_id))
    if (singleProject.length === 0) {
      return res.json({ success: false, mgs: "Can't delete project" });
    }
    await ProjectModel.deleteProject({ user_uuid: req.user.uuid }, { id: Number(req.params._id) });
    return res.json({
      mgs: "delete project",
      data: []
    });
  } catch (err) {
    return res.sendStatus(403);
  }
}

ProjectController.updateProjectFullFields = async (req, res) => {
  try {
    const { uuid: user_uuid } = req.user;
    const singleProject = await ProjectModel.getOneProject(user_uuid, Number(req.params._id))
    if (singleProject.length === 0) {
      return res.json({ success: false, mgs: "Not found project to update" });
    }


    await ProjectModel.updateProjectFullFields(req.body, { id: Number(req.params._id) }, { user_uuid: req.user.uuid });
    return res.json({
      mgs: "Update full fields for project",
      data: { id: Number(req.params._id), ...req.body }
    });
  } catch (err) {
    return res.sendStatus(403);
  }
}

ProjectController.updateProjectSomeFields = async (req, res) => {
  try {
    const { uuid: user_uuid } = req.user;
    const singleProject = await ProjectModel.getOneProject(user_uuid, Number(req.params._id))
    if (singleProject.length === 0) {
      return res.json({ success: false, mgs: "Not found project to update" });
    }
    await ProjectModel.updateProjectSomeFields(req.body, { id: Number(req.params._id) }, { user_uuid: req.user.uuid });

    return res.json({
      mgs: "Update some fields for project",
      data: { id: Number(req.params._id), ...req.body }
    });
  } catch (err) {
    return res.sendStatus(403);
  }

}

module.exports = ProjectController;