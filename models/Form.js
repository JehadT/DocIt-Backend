const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const formSchema = new Schema({
  attachments: [
    {
      fileNumber: { type: Number, required: true },
      filename: { type: String, required: true },
      path: { type: String, required: true },
    },
  ],
  trainee: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  status: { type: String, default: "Pending" },
  supervisorComments: { type: String },
  track: { type: String, required: true },
});

module.exports = mongoose.model("Form", formSchema);
