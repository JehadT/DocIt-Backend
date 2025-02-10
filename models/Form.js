const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const formSchema = new Schema(
  {
    attachments: [
      {
        fileNumber: { type: Number, required: true },
        fileName: { type: String, required: true },
        path: { type: String, required: true },
      },
    ],
    trainee: {
      type: mongoose.Types.ObjectId,
      unique: true,
      required: true,
      ref: "User",
    },
    status: { type: String, default: "تحت المراجعة" },
    supervisorComments: { type: String },
    track: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", formSchema);
