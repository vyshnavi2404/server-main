const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  customId: { type: String, unique: true },
  title: { type: String, required: true },
  Summary: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
  issueType: { type: String, enum: ['Task', 'Bug'], default: 'Task' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  assignedTo: { type: String, required: true },
  sprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  subIssues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubIssue' }],
  workflow: { type: [String], default: ['Open', 'In Progress', 'Closed'] } // Define allowed states
});

// Pre-save hook to generate customId
issueSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const project = await this.model('Project').findOne({ _id: this.projectId });
      const projectKey = project.key;
      let customId;
      let isUnique = false;

      for (let attempt = 0; attempt < 5; attempt++) {
        const issueCount = await this.constructor.countDocuments({ projectId: this.projectId });
        customId = `${projectKey}-${issueCount + 1 + attempt}`;
        const existingIssue = await this.constructor.findOne({ customId });
        if (!existingIssue) {
          isUnique = true;
          break;
        }
      }

      if (!isUnique) {
        throw new Error('Failed to generate a unique customId');
      }

      this.customId = customId;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Issue', issueSchema);