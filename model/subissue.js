const mongoose = require('mongoose');

const subIssueSchema = new mongoose.Schema({
  customId: { type: String, unique: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  subissueType: { type: String, enum: ['SubTask', 'Bug'], default: 'SubTask' },
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  assignedTo: { type: String, required: true },
  parentIssue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  sprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint', required: true },
  workflow: { type: [String], default: ['Open', 'In Progress', 'Closed'] }
});

// Pre-save hook to generate customId
subIssueSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const parentIssue = await this.model('Issue').findById(this.parentIssue).populate('projectId');
      const project = await this.model('Project').findById(parentIssue.projectId);
      const projectKey = project.key;
      let customId;
      let isUnique = false;

      for (let attempt = 0; attempt < 5; attempt++) {
        const subIssueCount = await this.constructor.countDocuments({ parentIssue: this.parentIssue });
        customId = `${parentIssue.customId}-SUB-${subIssueCount + 1 + attempt}`;
        const existingSubIssue = await this.constructor.findOne({ customId });
        if (!existingSubIssue) {
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

module.exports = mongoose.model('SubIssue', subIssueSchema);