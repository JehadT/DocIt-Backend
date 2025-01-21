const Form = require("../models/Form");
const User = require("../models/User");

const forms = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files were uploaded" });
    }
    const user = await User.findById(req.user.userId).select(
      "-password -userType -_id -__v"
    );
    const traineeId = req.user.userId;
    const files = req.files.map((file, index) => ({
      fileNumber: index + 1,
      filename: file.filename,
      path: file.path,
    }));

    const newForm = await Form.create({
      attachments: files,
      traineeInfo: user,
      traineeId,
    });

    res
      .status(201)
      .json({ message: "Form submitted successfully", form: newForm });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { forms };
