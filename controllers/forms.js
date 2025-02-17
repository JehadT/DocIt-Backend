const Form = require("../models/Form");
const User = require("../models/User");
const { NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createForm = async (req, res) => {
  if (req.files.length < 16 || req.files.length > 17) {
    return res.status(400).json({ error: "Number of files uploaded is not as required" });
  }
  const track = req.user.track;
  const trainee = req.user.userId;
  const files = req.files.map((file, index) => ({
    fileNumber: index + 1,
    fileName: file.filename,
    path: file.path,
  }));
  
  try {
    const newForm = await Form.create({
      attachments: files,
      trainee,
      track,
    });
    await User.findByIdAndUpdate(
      { _id: trainee },
      {
        hasSubmittedForm: true,
      }
    );
    res
      .status(201)
      .json({ message: "Form submitted successfully", form: newForm });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateForm = async (req, res) => {
  const {
    params: { id: formId },
  } = req;
  if (!req.files || req.files.length > 17) {
    return res.status(400).json({ error: "Highest upload is 17 files" });
  }
  const trainee = req.user.userId;
  const files = req.files.map((file, index) => ({
    fileNumber: index + 1,
    fileName: file.filename,
    path: file.path,
  }));
  try {
    await Form.findByIdAndUpdate(
      { _id: formId },
      {
        attachments: files,
        supervisorComments: null,
        status: "تحت المراجعة",
      }
    );
    await User.findByIdAndUpdate(
      { _id: trainee },
      {
        hasSubmittedForm: true,
      }
    );
    res.status(200).json({ message: "Form updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllForms = async (req, res) => {
  const track = req.user.track;
  try {
    const forms = await Form.find({ track: track })
      .populate("trainee", "name")
      .select("track status createdAt updatedAt")
      .sort({ updatedAt: -1 });
    res.status(200).json({ forms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getForm = async (req, res) => {
  const {
    params: { id: formId },
  } = req;
  const form = await Form.findOne({ _id: formId }).populate(
    "trainee",
    "-__v -_id -password -userType"
  );
  if (!form) {
    throw new NotFoundError(`No form was found with ID ${formId}`);
  }
  res.status(StatusCodes.OK).json(form);
};

const getFormByTraineeId = async (req, res) => {
  const trainee = req.user.userId;
  const form = await Form.findOne({ trainee: trainee });
  if (!form) {
    return res.status(StatusCodes.OK).send(false);
  }
  res.status(StatusCodes.OK).json(form);
};

const declineForm = async (req, res) => {
  const {
    params: { id: formId },
  } = req;
  try {
    const form = await Form.findByIdAndUpdate(
      { _id: formId },
      { status: "مرفوضة", supervisorComments: "" }
    );
    const traineeId = form.trainee;
    await User.findByIdAndUpdate(
      { _id: traineeId },
      {
        hasSubmittedForm: true,
      }
    );
    res.status(StatusCodes.OK).json({ msg: "Form updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveForm = async (req, res) => {
  const {
    params: { id: formId },
  } = req;
  try {
    const form = await Form.findByIdAndUpdate(
      { _id: formId },
      { status: "مقبولة", supervisorComments: "" }
    );
    const traineeId = form.trainee;
    await User.findByIdAndUpdate(
      { _id: traineeId },
      {
        hasSubmittedForm: true,
      }
    );
    res.status(StatusCodes.OK).json({ msg: "Form updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const returnForm = async (req, res) => {
  const {
    params: { id: formId },
    body: { supervisorComments: supervisorComments },
  } = req;
  if (!supervisorComments || supervisorComments.trim() === "") {
    return res.status(400).json({ error: "Supervisor comments are required" });
  }
  try {
    const form = await Form.findByIdAndUpdate(
      { _id: formId },
      { status: "مُعادة", supervisorComments: supervisorComments }
    );
    const traineeId = form.trainee;
    await User.findByIdAndUpdate(
      { _id: traineeId },
      {
        hasSubmittedForm: false,
      }
    );
    res.status(StatusCodes.OK).json({ msg: "Form updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createForm,
  updateForm,
  getAllForms,
  getForm,
  getFormByTraineeId,
  declineForm,
  approveForm,
  returnForm,
};
