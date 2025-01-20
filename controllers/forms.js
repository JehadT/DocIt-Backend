const Form = require("../models/Form");

const forms = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files were uploaded" });
    }
    const { track, traineeId } = req.body;
    const files = req.files.map((file) => ({
      filename: file.filename,
      path: file.path,
    }));

    // Create a new form with the uploaded files
    const newForm = new Form({
      attachments: files,
      track,
      traineeId,
    });

    await newForm.save();
    res
      .status(201)
      .json({ message: "Form submitted successfully", form: newForm });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { forms };
