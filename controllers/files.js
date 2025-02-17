const { NotFoundError } = require("../errors");
const Form = require("../models/Form");
const path = require("path");
const zip = require("express-zip");
const fs = require('fs')

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
    if (!files || files.length == 0) {
      throw new NotFoundError("No attachment was found");
    }
    var result = [];
    for (const file of files) {
      const filePath = path.resolve(file.path);
      const fileName = file.fileName;
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "files not found" })      }
      result.push({ path: filePath, name: fileName });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "No valid files to download" });
    }
    const traineeNationalId = form.trainee.nationalId;
    const traineeTrack = form.trainee.track;
    res.zip(result, `${traineeNationalId} - ${traineeTrack}.zip`, (err) => {
      if (err) {
        if (!res.headersSent) {
          return res.status(500).json({ error: "Something went wrong!" });
        }
      }
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Something went wrong!" });
    }
  }
};

module.exports = { downloadSingleFile, downloadManyFiles };
