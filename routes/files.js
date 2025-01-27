const express = require("express");
const router = express.Router();

const { downloadFile } = require("../controllers/files");

const verifySupervisor = require("../middleware/verifySupervisor");

router.get("/downloadFile/:id", verifySupervisor, downloadFile);

module.exports = router;
