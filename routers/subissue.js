const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const SubIssue = require('../model/subissue');
const Issue = require('../model/issue');

// Get individual sub-issue
router.get('/:id', async (req, res) => {
  try {
    const subissue = await SubIssue.findById(req.params.id).populate('assignedTo');
    if (!subissue) {
      return res.status(404).json({ message: 'Sub-issue not found' });
    }
    res.json(subissue);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new sub-issue
router.post('/issue/:issueId', [
  check('title').notEmpty().withMessage('Title is required'),
  check('assignedTo').notEmpty().withMessage('Assigned user is required')
], async (req, res) => {
  try {
    const { issueId } = req.params;
    const { title, summary, subissueType, status, priority, assignedTo } = req.body;

    const parentIssue = await Issue.findById(issueId);
    if (!parentIssue) {
      return res.status(404).json({ message: 'Parent issue not found' });
    }

    const newSubIssue = new SubIssue({
      title,
      summary,
      subissueType: subissueType || 'SubTask',
      status: status || 'Open',
      priority: priority || 'Medium',
      assignedTo,
      parentIssue: issueId,
      projectId: parentIssue.projectId,
      sprintId: parentIssue.sprintId
    });

    await newSubIssue.save();
    parentIssue.subIssues.push(newSubIssue._id);
    await parentIssue.save();

    res.status(201).json(newSubIssue);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create sub-issue', error: error.message });
  }
});

// Get all sub-issues for an issue
router.get('/issue/:issueId', async (req, res) => {
  try {
    const { issueId } = req.params;
    const subIssues = await SubIssue.find({ parentIssue: issueId }).populate('assignedTo');
    res.status(200).json(subIssues);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch sub-issues', error: error.message });
  }
});

// Update a sub-issue
router.put('/:id', [
  check('status').optional().isIn(['Open', 'In Progress', 'Closed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const subissue = await SubIssue.findById(req.params.id);
    if (!subissue) {
      return res.status(404).json({ message: 'Sub-issue not found' });
    }

    subissue.title = req.body.title || subissue.title;
    subissue.summary = req.body.summary || subissue.summary;
    subissue.subissueType = req.body.subissueType || subissue.subissueType;
    subissue.status = req.body.status || subissue.status;
    subissue.priority = req.body.priority || subissue.priority;
    subissue.assignedTo = req.body.assignedTo || subissue.assignedTo;
    subissue.updatedDate = Date.now();

    const updatedSubIssue = await subissue.save();
    res.json(updatedSubIssue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a sub-issue
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subIssue = await SubIssue.findById(id);
    if (!subIssue) {
      return res.status(404).json({ message: 'Sub-issue not found' });
    }

    const parentIssue = await Issue.findById(subIssue.parentIssue);
    parentIssue.subIssues.pull(id);
    await parentIssue.save();

    await SubIssue.findByIdAndDelete(id);
    res.status(200).json({ message: 'Sub-issue deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete sub-issue', error: error.message });
  }
});

module.exports = router;