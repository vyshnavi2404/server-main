const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Issue = require('../model/issue');
const Project = require('../model/project');
const Sprint = require('../model/sprint');

// Jira-like workflow transitions
const WORKFLOW_TRANSITIONS = {
  'Open': ['In Progress', 'Closed'],
  'In Progress': ['Open', 'Closed'],
  'Closed': ['Open']
};

// Get all issues for a sprint
router.get('/:sprintId', async (req, res) => {
  try {
    const sprintId = req.params.sprintId;
    const issues = await Issue.find({ sprintId }).populate('assignedTo subIssues');
    res.json(issues);
  } catch (err) {
    console.error("Error fetching issues:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get task statistics
router.get('/stats/all', async (req, res) => {
  try {
    const totalTasks = await Issue.countDocuments();
    const openTasks = await Issue.countDocuments({ status: 'Open' });
    const inProgressTasks = await Issue.countDocuments({ status: 'In Progress' });
    const closedTasks = await Issue.countDocuments({ status: 'Closed' });
    const overdueTasks = await Issue.countDocuments({
      status: { $ne: 'Closed' },
      dueDate: { $lt: new Date() }
    });

    res.json({
      totalTasks,
      openTasks,
      inProgressTasks,
      closedTasks,
      overdueTasks
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
});

// Create a new issue for a sprint
router.post('/:sprintId', [
  check('title').notEmpty().withMessage('Title is required'),
  check('sprintId').notEmpty().withMessage('Sprint ID is required'),
  check('assignedTo').notEmpty().withMessage('Assigned user is required'),
  check('projectId').notEmpty().withMessage('Project ID is required')
], async (req, res) => {
  const sprintId = req.params.sprintId;
    const { title, Summary, status, issueType, priority, assignedTo, projectId, dueDate } = req.body;

    const issue = new Issue({
      title,
      Summary,
      status: status || 'Open',
      issueType: issueType || 'Task',
      priority: priority || 'Medium',
      assignedTo,
      projectId,
      sprintId,
      dueDate
    });

    const newIssue = await issue.save();
    sprint.issues = sprint.issues || [];
    sprint.issues.push(newIssue._id);
    await sprint.save();

    project.issues = project.issues || [];
    project.issues.push(newIssue._id);
    await project.save();

    res.status(201).json(newIssue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single issue
router.get('/:sprintId/task/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('assignedTo subIssues');
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json(issue);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update an issue
router.put('/:id', [
  check('status').optional().isIn(['Open', 'In Progress', 'Closed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Validate workflow transition
    if (req.body.status && !WORKFLOW_TRANSITIONS[issue.status].includes(req.body.status)) {
      return res.status(400).json({ message: `Invalid transition from ${issue.status} to ${req.body.status}` });
    }

    issue.title = req.body.title || issue.title;
    issue.Summary = req.body.Summary || issue.Summary;
    issue.status = req.body.status || issue.status;
    issue.issueType = req.body.issueType || issue.issueType;
    issue.priority = req.body.priority || issue.priority;
    issue.assignedTo = req.body.assignedTo || issue.assignedTo;
    issue.dueDate = req.body.dueDate || issue.dueDate;
    issue.updatedDate = Date.now();

    const updatedIssue = await issue.save();
    res.json(updatedIssue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an issue
router.delete('/:id', async (req, res) => {
  try {
    const issue = await Issue.findOneAndDelete({ _id: req.params.id });
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    await Sprint.updateOne({ issues: issue._id }, { $pull: { issues: issue._id } });
    await Project.updateOne({ issues: issue._id }, { $pull: { issues: issue._id } });

    res.json({ message: 'Issue deleted' });
  } catch (err) {
    console.error('Error deleting issue:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;