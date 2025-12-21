import express from "express";
import {
	submitReview,
	approveReview,
	rejectReview,
	getBookReviews,
	getPendingReviews,
	deleteReview,
	updateReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, submitReview);

// Pending & Approval Routes
router.get(
	"/pending",
	protect,
	authorize("admin", "teacher"),
	getPendingReviews
);
router.put(
	"/:id/approve",
	protect,
	authorize("admin", "teacher"),
	approveReview
);
router.delete("/:id", protect, deleteReview);
router.put("/:id", protect, updateReview);
router.put("/:id/reject", protect, authorize("admin", "teacher"), rejectReview);

// Public Reviews
router.get("/book/:id", protect, getBookReviews);

export default router;
