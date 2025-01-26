const express = require("express");
const router = express.Router();

const { createForm, getAllForms, getForm } = require("../controllers/forms");

const verifyTrainee = require("../middleware/verifyTrainee");
const verifySupervisor = require("../middleware/verifySupervisor");

const upload = require("../middleware/upload");

router.post("/upload", verifyTrainee, upload, createForm);
router.get("/getAllForms", verifySupervisor, getAllForms);
router.get("/getForm/:id", verifySupervisor, getForm);

module.exports = router;
