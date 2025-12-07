import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure "uploads" folder exists
const uploadDir = path.join(process.cwd(), "uploads");

// Remove any existing file named "uploads" and create directory
if (fs.existsSync(uploadDir)) {
  const stats = fs.statSync(uploadDir);
  if (stats.isFile()) {
    fs.unlinkSync(uploadDir);
  }
}

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`✅ Created uploads directory: ${uploadDir}`);
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // absolute path now
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"));
  }
};

// Configure multer with error handling
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 5MB." });
    }
    return res.status(400).json({ message: error.message });
  } else if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

export default upload;
