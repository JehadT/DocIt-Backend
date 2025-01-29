const express = require("express");
const router = express.Router();

const {
  downloadSingleFile,
  downloadManyFiles,
} = require("../controllers/files");

const verifySupervisor = require("../middleware/verifySupervisor");

router.get("/downloadSingleFile/:id", verifySupervisor, downloadSingleFile);
router.get("/downloadManyFiles/:id", verifySupervisor, downloadManyFiles);

module.exports = router;
