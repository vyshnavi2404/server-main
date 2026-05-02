const express = require('express');
const router = express.Router();
const Sprint = require('../model/sprint');
const Project = require('../model/project');

// Get all sprints
router.get('/', async (req, res) => {
  try {
    const sprints = await Sprint.find();
    res.json(sprints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single sprint by ID
router.get('/:id', async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    res.json(sprint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Create a new sprint
// Create a new sprint
router.post('/', async (req, res) => {
  const { sprintName, sprintType, projectId } = req.body;

  try {
    // Create a new sprint
    const sprint = new Sprint({
      sprintName,
      sprintType,
      projectId
    });

    // Save the sprint to the database
    const newSprint = await sprint.save();

    // Add the sprint to the project's sprint list
    const project = await Project.findById(projectId);

    // Ensure project.sprints is defined before pushing
    if (!project.sprints) {
      project.sprints = [];
    }

    project.sprints.push(newSprint._id);
    await project.save();

    res.status(201).json(newSprint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single sprint
router.get('/:id', async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    res.json(sprint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a sprint
router.put('/:id', async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    sprint.sprintName = req.body.sprintName || sprint.sprintName;
    sprint.sprintType = req.body.sprintType || sprint.sprintType;
    sprint.updatedDate = Date.now();

    const updatedSprint = await sprint.save();
    res.json(updatedSprint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a sprint
router.delete('/:id', async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    await sprint.remove();

    // Remove the sprint from the project's sprint list
    const project = await Project.findById(sprint.projectId);
    project.sprints.pull(sprint._id);
    await project.save();

    res.json({ message: 'Sprint deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/project/:projectId', async (req, res) => {
  try {
    const sprints = await Sprint.find({ projectId: req.params.projectId });
    if (!sprints || sprints.length === 0) {
      return res.status(404).json({ message: 'No sprints found for this project' });
    }
    res.json(sprints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
