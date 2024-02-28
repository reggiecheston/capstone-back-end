const express = require('express');
const router = express.Router();
const { projects } = require('../data');
// gets all projects
router.get('/', (req, res) => {
    res.json(projects);
});

// gets single project
router.get('/:projectId', setProject, (req, res) => {
    res.json(res.project);
});


// sets project for all routes
function setProject(req, res, next) {
    const projectId = parseInt(req.params.projectId);
    res.project = projects.find(project => project.id === projectId);
    if (res.project == null) {
        res.status(404);
        return res.send('Project not found');
    }
    next();
}


module.exports = router;
