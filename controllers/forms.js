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
  const { id: formId } = req.params;
  const trainee = req.user.userId;

  try {
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Process each uploaded file
    const updates = req.files.map((file) => {
      const matches = file.fieldname.match(/\[(\d+)\]/);
      if (!matches) throw new Error("Invalid fieldname format");
      const fileNumber = parseInt(matches[1], 10);
      return {
        fileNumber,
        fileName: file.filename,
        path: file.path,
      };
    });    
    // Update existing attachments
    updates.forEach((update) => {
      const attachment = form.attachments.find(
        (a) => a.fileNumber === update.fileNumber
      );
      if (!attachment) {
        throw new Error(`FileNumber ${update.fileNumber} not found`);
      }
      attachment.fileName = update.fileName;
      attachment.path = update.path;
      attachment.isReturned = false; // Reset isReturned
    });

    form.supervisorComments = null;
    form.status = "تحت المراجعة";
    await form.save();

    await User.findByIdAndUpdate(
      trainee,
      { hasSubmittedForm: true },
      { new: true }
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
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    form.attachments.forEach(attachment => {
      attachment.isReturned = false;
    });
    form.status = "مرفوضة";
    form.supervisorComments = "";
    await form.save();
    await User.findByIdAndUpdate(form.trainee, { hasSubmittedForm: true });
    res.status(200).json({ msg: "Form declined successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveForm = async (req, res) => { 
  const {
    params: { id: formId },
  } = req;
  try {
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    form.attachments.forEach(attachment => {
      attachment.isReturned = false;
    });
    form.status = "مقبولة";
    form.supervisorComments = "";
    await form.save();
    await User.findByIdAndUpdate(form.trainee, { hasSubmittedForm: true });
    res.status(200).json({ msg: "Form approved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const returnForm = async (req, res) => {
  const {
    params: { id: formId },
    body: { supervisorComments, selectedFiles },
  } = req;

  if (!supervisorComments || supervisorComments.trim() === "") {
    return res.status(400).json({ error: "Supervisor comments are required" });
  }  

  if (!Array.isArray(selectedFiles) || selectedFiles.length === 0) {
    return res.status(400).json({ error: "File numbers must be a non-empty array" });
  }

  if (!selectedFiles.every(num => Number.isInteger(num) && num > 0)) {
    return res.status(400).json({ error: "File numbers must contain only positive integers" });
  }

  try {
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    form.attachments.forEach(attachment => {
      if (selectedFiles.includes(attachment.fileNumber)) {
        attachment.isReturned = true; 
      }
    });
    form.status = "مُعادة";
    form.supervisorComments = supervisorComments;
    await form.save();
    await User.findByIdAndUpdate(form.trainee, { hasSubmittedForm: false });
    res.status(200).json({ msg: "Form updated successfully" });
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
