// // const mongoose = require('mongoose');

// // const sprintSchema = new mongoose.Schema({
// //   sprintName: { type: String, required: true },
// //   startDate: { type: Date, required: true },
// //   endDate: { type: Date, required: true },
// //   // issues: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
// //   issues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }] ,

// //   project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
// // });

// // module.exports = mongoose.model('Sprint', sprintSchema);
// // const mongoose = require('mongoose');
// // const Schema = mongoose.Schema;

// // const SprintSchema = new Schema({
// //   sprintName: { type: String, required: true },
// //   startDate: { type: Date, required: true },
// //   endDate: { type: Date, required: true },
// //   project: { type: Schema.Types.ObjectId, ref: 'Project' }  // Reference to Project
// // });

// // module.exports = mongoose.model('Sprint', SprintSchema);
// const mongoose = require('mongoose');

// const sprintSchema = new mongoose.Schema({
//   sprintName: { type: String, required: true },
//   sprintType: { type: String, required: true },  
//   createdDate: { type: Date, default: Date.now },
//   updatedDate: { type: Date, default: Date.now },
//   issues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }] ,
//   projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
  
// });

// module.exports = mongoose.model('Sprint', sprintSchema);
const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
    sprintName: { type: String, required: true },
    sprintType: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    issues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }],
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
});

// Middleware to format date before saving
sprintSchema.pre('save', function (next) {
    this.createdDate = new Date(this.createdDate); // Ensure Date object
    this.updatedDate = new Date(this.updatedDate); // Ensure Date object
    next();
});

module.exports = mongoose.model('Sprint', sprintSchema);
