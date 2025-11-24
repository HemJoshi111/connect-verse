import multer from "multer"

// Configure storage: Store files in memory as a Buffer
const storage = multer.memoryStorage();

// File Filter: Accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error("'Not an image! Please upload only images.'"), false)
    }
}

// Initialize Multer

const upload = multer({
    storage, fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
})

export default upload;
