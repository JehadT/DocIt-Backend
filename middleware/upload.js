const multer = require("multer");

const fileNames = require("../utils/fileNames");

const fileExtensions = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store uploaded files
  },
  filename: (req, file, cb) => {
    if (!req.fileIndex) req.fileIndex = 1;

    const userName = req.user.name;
    const extension = fileExtensions[file.mimetype];

    const finalName = `${fileNames[req.fileIndex]} - ${userName}.${extension}`;
    req.fileIndex += 1;
    cb(null, finalName);
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
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, Word and Excel files are allowed!"));
    }
  },
});

module.exports = upload.array("attachments", 17); // number of attchments
