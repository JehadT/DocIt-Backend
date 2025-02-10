const express = require("express");
const router = express.Router();

const {
  createForm,
  updateForm,
  getAllForms,
  getForm,
  getFormByTraineeId,
  declineForm,
  approveForm,
  returnForm,
} = require("../controllers/forms");

const verifyTrainee = require("../middleware/verifyTrainee");
const verifySupervisor = require("../middleware/verifySupervisor");

const upload = require("../middleware/upload");

router.post("/upload", verifyTrainee, upload, createForm);
router.patch("/updateForm/:id", verifyTrainee, upload, updateForm);
router.get("/getFormByTraineeId", verifyTrainee, getFormByTraineeId);

router.get("/getAllForms", verifySupervisor, getAllForms);
router.get("/getForm/:id", verifySupervisor, getForm);
router.patch("/declineForm/:id", verifySupervisor, declineForm);
router.patch("/approveForm/:id", verifySupervisor, approveForm);
router.patch("/returnForm/:id", verifySupervisor, returnForm);

module.exports = router;
