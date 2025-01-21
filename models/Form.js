const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formSchema = new Schema({
  attachments: [
    {
      fileNumber: { type: Number, required: true }, 
      filename: { type: String, required: true },
      path: { type: String, required: true },
    },
  ],
  traineeInfo: {
    name: {type: String, required: true},
    track: {type: String, required: true},
    major: {type: String, required: true},
    nationalId: {type: Number, required: true},
    gender: {type: String, required: true},
    email: {type: String, required: true},
    phoneNumber: {type: Number, required: true},
  },
  traineeId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }, 
  status: { type: String, default: 'Pending' },
  supervisorComments: { type: String }, 
});

module.exports = mongoose.model('Form', formSchema);
