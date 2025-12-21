import express from "express";
import {
	createBook,
	getBooks,
	approveBook,
	getBookById,
	getPendingBooks,
	debugBookScore,
	deleteBook,
	updateBook,
	rejectBook,
} from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
	"/",
	protect,
	authorize("teacher", "admin", "student"),
	upload.fields([
		{ name: "pdf", maxCount: 1 },
		{ name: "cover", maxCount: 1 },
	]),
	createBook
);
router.get("/debug/:id", debugBookScore);
router.get("/", protect, getBooks);
router.get("/pending", protect, authorize("admin", "teacher"), getPendingBooks);
router.get("/:id", protect, getBookById);
router.put("/:id/approve", protect, authorize("admin", "teacher"), approveBook);
router.delete("/:id", protect, deleteBook);
router.put("/:id", protect, updateBook);
router.put("/:id/reject", protect, authorize("admin"), rejectBook);
export default router;
