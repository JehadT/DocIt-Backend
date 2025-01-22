const express = require("express");
const router = express.Router();

const { createForm } = require("../controllers/forms");
const verifyTrainee = require('../middleware/verifyTrainee')
const upload = require("../middleware/upload");


router.post("/upload", verifyTrainee, upload, createForm);

module.exports = router;
