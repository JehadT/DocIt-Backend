const multer = require("multer");
const fileNames = require("../utils/fileNames");

const fileExtensions = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const matches = file.fieldname.match(/\[(\d+)\]/); // Extract fileNumber from fieldname
    if (!matches) {
      return cb(new Error("Invalid fieldname format"));
    }
    const fileNumber = parseInt(matches[1], 10);
    const userName = req.user.name;
    const extension = fileExtensions[file.mimetype];
    const fileName = fileNames[fileNumber]; // Get predefined name using fileNumber
    const finalName = `${userName} - ${fileName}.${extension}`;
    cb(null, finalName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("الملفات المدعومة هي (PDF, Word, Excel)"));
    }
  },
});

// Custom middleware to handle dynamic field names
const handleUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    // Filter files to only those with fieldnames like 'attachments[number]'
    req.files = req.files.filter((file) =>
      /^attachments\[\d+\]$/.test(file.fieldname)
    );
    if (req.files.length > 17) {
      return res.status(400).json({ error: "Highest upload is 17 files" });
    }
    next();
  });
};

module.exports = handleUpload;