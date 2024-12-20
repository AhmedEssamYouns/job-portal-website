const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Path to save images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Filename with timestamp
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB size limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);  // Accept only image files
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  }
});

module.exports = upload;
