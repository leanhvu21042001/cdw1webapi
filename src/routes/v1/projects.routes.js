const express = require('express');
const ProjectController = require('../../controllers/project.controller');
const router = express.Router();
const verifyJWT = require('../../middlewares/verifyJWT');

// @route GET api/v1/projects/
// @desc Get all projects, with user uuid
// @access private
router.get('/', verifyJWT, ProjectController.getAllProjects);

// @route GET api/v1/projects/:_id
// @desc Get one project, with user uuid
// @access private
router.get('/:_id', verifyJWT, ProjectController.getOneProject);

// @route POST api/v1/projects/
// @desc Create new project, with user uuid
// @access private
router.post('/', verifyJWT, ProjectController.createNewProject);

// @route DELETE api/v1/projects/
// @desc Delete a project, with user uuid
// @access private
router.delete('/:_id', verifyJWT, ProjectController.deleteProject);

// @route PUT api/v1/projects/
// @desc Update a project with full fields, with user uuid
// @access private
router.put('/:_id', verifyJWT, ProjectController.updateProjectFullFields);

// @route PATCH api/v1/projects/
// @desc Update a project with full fields, with user uuid
// @access private
router.patch('/:_id', verifyJWT, ProjectController.updateProjectSomeFields);

module.exports = router;