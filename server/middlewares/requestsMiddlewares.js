const multer = require("multer");
const path = require("path");

const destination = path.join(__dirname, "..", "storage/requests");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, destination);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedTypes.includes(ext)) {
    return cb(new Error("Дозволені лише файли: .jpg, .jpeg, .png"));
  }
  cb(null, true);
};

const requestsPhoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = requestsPhoto;
