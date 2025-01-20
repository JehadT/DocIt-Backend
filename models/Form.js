const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formSchema = new Schema({
  attachments: [
    {
      filename: { type: String, required: true },
      path: { type: String, required: true },
    },
  ],
  track: { type: String, required: true }, // Track associated with the form
  traineeId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }, // Reference to the trainee who submitted
  status: { type: String, default: 'Pending' }, // e.g., Pending, Approved, Rejected
  supervisorComments: { type: String }, // Comments from the supervisor
});

module.exports = mongoose.model('Form', formSchema);
