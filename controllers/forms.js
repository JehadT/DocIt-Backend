const { NotFoundError } = require("../errors/not-found");
const { param } = require("express/lib/router");
const Form = require("../models/Form");
const { StatusCodes } = require("http-status-codes");

const createForm = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files were uploaded" });
    }
    const track = req.user.track;
    const trainee = req.user.userId;
    const files = req.files.map((file, index) => ({
      fileNumber: index + 1,
      filename: file.filename,
      path: file.path,
    }));

    const newForm = await Form.create({
      attachments: files,
      trainee,
      track,
    });

    res
      .status(201)
      .json({ message: "Form submitted successfully", form: newForm });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllForms = async (req, res) => {
  try {
    const track = req.user.track;
    const forms = await Form.find({ track: track }).populate(
      "trainee",
      "-__v -password -userType"
    );
    res.status(200).json({ forms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getForm = async (req, res) => {
  const {
    params: { id: formId },
  } = req;
  const form = await Form.findOne({ _id: formId });
  if (!form) {
    throw new NotFoundError(`No form was found with ID ${formId}`);
  }
  res.status(StatusCodes.OK).json(form);
};
module.exports = { createForm, getAllForms, getForm };
