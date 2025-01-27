const { NotFoundError } = require("../errors");
const Form = require("../models/Form");
const path = require("path");

const downloadFile = async (req, res) => {
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

module.exports = { downloadFile };
