const express = require("express");
const router = express.Router();

const { deleteFormAndSetUserFalse } = require("../controllers/dev");

router.post("/dev/:id", deleteFormAndSetUserFalse);

module.exports = router;
