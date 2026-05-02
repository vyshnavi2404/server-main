// // const mongoose = require('mongoose');

// // const projectSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   key: { type: String, required: true },
// //   type : { type: String },
// //   sprint: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' }]
// // });

// // module.exports = mongoose.model('Project', projectSchema);
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const projectSchema = new Schema({
//   name: { type: String, required: true },
//   key: { type: String, required: true },
//   type: { type: String },
//   sprints: [{ type: Schema.Types.ObjectId, ref: 'Sprint' }]  // Ensure the field name is 'sprints'
// });

// module.exports = mongoose.model('Project', projectSchema);
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true },
  type: { type: String, required: true },  
  sprints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' }] 
  
});

module.exports = mongoose.model('Project', projectSchema);