const { NotFoundError } = require("../errors");
const Form = require("../models/Form");
const path = require("path");
const zip = require("express-zip");

const downloadSingleFile = async (req, res) => {
  try {
    const {
      params: { id: fileId },
    } = req;
    const file = await Form.findOne(
      { "attachments._id": fileId },
      "attachments"
    );
    if (!file) {
      throw new NotFoundError("Attachment not found");
    }
    const filterFile = file.attachments.find(
      (f) => f._id.toString() === fileId
    );
    if (!filterFile) {
      throw new NotFoundError("Attachment not found");
    }
    const filePath = path.resolve(filterFile.path);
    return res.download(filePath, filterFile.fileName, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

const downloadManyFiles = async (req, res) => {
  try {
    const {
      params: { id: formId },
    } = req;
    const form = await Form.findOne({ _id: formId }).populate(
      "trainee",
      "name nationalId track"
    );
    if (!form) {
      throw new NotFoundError("Form not found");
    }
    const files = form.attachments;
    if (!files) {
      throw new NotFoundError("No attachment was found");
    }
    var result = [];
    for (const file in files) {
      const filePath = path.resolve(files[file].path);
      const fileName = files[file].fileName;
      result.push({ path: filePath, name: fileName });
    }
    const traineeNationalId = form.trainee.nationalId;
    const traineeTrack = form.trainee.track;
    return res.zip(
      result,
      `${traineeNationalId} - ${traineeTrack}.zip`,
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Something went wrong!" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

module.exports = { downloadSingleFile, downloadManyFiles };
