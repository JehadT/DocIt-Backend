const express = require("express");
const router = express.Router();

const { forms } = require("../controllers/forms");
const upload = require("../middleware/upload");

router.post("/upload", upload, forms);

module.exports = router;
