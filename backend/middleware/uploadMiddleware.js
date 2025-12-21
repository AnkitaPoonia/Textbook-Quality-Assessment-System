import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, "uploads/");
	},
	filename(req, file, cb) {
		// Sanitize filename to remove spaces/special chars which can cause link issues
		const cleanName = file.originalname.replace(/\s+/g, "-");
		cb(null, `${Date.now()}-${cleanName}`);
	},
});

const checkFileType = (file, cb) => {
	const filetypes = /pdf|jpeg|jpg|png|gif/;

	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

	const mimetype = filetypes.test(file.mimetype);

	if (extname && mimetype) {
		return cb(null, true);
	} else {
		cb(new Error("Error: Only Images (JPEG/PNG) and PDFs are allowed!"));
	}
};

const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
});

export default upload;
