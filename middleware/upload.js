const multer = require("multer");

const fileNames = require("../utils/fileNames");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store uploaded files
  },
  filename: (req, file, cb) => {
    if (!req.fileIndex) req.fileIndex = 1;
    const userName = req.user.name;
    cb(null, fileNames[req.fileIndex] + " - " + userName + ".pdf");
    req.fileIndex += 1;
  },
});

// Multer upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, Word and Excel files are allowed!"));
    }
  },
});

module.exports = upload.array("attachments", 17); // number of attchments
