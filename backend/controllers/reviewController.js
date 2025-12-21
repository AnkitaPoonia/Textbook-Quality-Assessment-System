import Review from "../models/Review.js";
import Score from "../models/Score.js";
import User from "../models/User.js";
import CreditHistory from "../models/CreditHistory.js";
import Book from "../models/Book.js";
import { calculateScore } from "./scoreController.js";
export const deleteReview = async (req, res) => {
	try {
		const review = await Review.findById(req.params.id);
		if (!review) return res.status(404).json({ message: "Review not found" });

		// Check: Admin OR Owner
		if (
			req.user.role !== "admin" &&
			review.userId.toString() !== req.user._id.toString()
		) {
			return res.status(403).json({ message: "Not authorized" });
		}

		const bookId = review.bookId; // Save ID before deleting
		await review.deleteOne();

		// 🔄 RECALCULATE SCORE
		await calculateScore(bookId);

		res.json({ message: "Review deleted and score updated" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting review" });
	}
};
export const updateReview = async (req, res) => {
	try {
		const review = await Review.findById(req.params.id);
		if (!review) return res.status(404).json({ message: "Review not found" });

		if (
			req.user.role !== "admin" &&
			review.userId.toString() !== req.user._id.toString()
		) {
			return res.status(403).json({ message: "Not authorized" });
		}

		// We only allow updating the comment to avoid complex score recalculation logic here
		review.comment = req.body.comment || review.comment;
		await review.save();

		res.json(review);
	} catch (error) {
		res.status(500).json({ message: "Error updating review" });
	}
};
export const submitReview = async (req, res) => {
	console.log("🔥 HIT: submitReview Endpoint");
	try {
		// 1. Debug Payload
		console.log("   -> Body:", req.body);
		console.log("   -> User:", req.user ? req.user._id : "NO USER FOUND");

		const { bookId, scores, comment } = req.body;
		const userId = req.user._id;

		// 2. Validate User
		if (!req.user) {
			throw new Error("User not authenticated in controller");
		}

		// 3. Check Duplicate
		const existingReview = await Review.findOne({ bookId, userId });
		if (existingReview) {
			console.log("   -> Duplicate Review Detected");
			return res
				.status(400)
				.json({ message: "You have already reviewed this book!" });
		}

		// 4. Validate Scores
		// Scores must be an array, even if empty
		const scoresPayload = Array.isArray(scores) ? scores : [];
		console.log("   -> Processing Scores:", scoresPayload.length);

		// 5. Save Scores (This is where it often fails if Score model is wrong)
		let scoreDocs = [];
		if (scoresPayload.length > 0) {
			try {
				scoreDocs = await Score.insertMany(scoresPayload);
				console.log(
					"   -> Score Docs Created:",
					scoreDocs.map((s) => s._id)
				);
			} catch (err) {
				console.error("   ❌ ERROR INSERTING SCORES:", err.message);
				throw new Error(`Score Data Error: ${err.message}`);
			}
		}

		// 6. Create Review
		console.log("   -> Creating Review Object...");
		const review = await Review.create({
			bookId,
			userId,
			role: req.user.role || "student", // Fallback if role missing
			scores: scoreDocs.map((s) => s._id),
			comment: comment || "",
			status: "approved",
		});
		console.log("   -> Review Created ID:", review._id);

		// 7. Update User Stats
		await User.findByIdAndUpdate(userId, {
			$inc: { "stats.reviewsSubmitted": 1 },
		});
		console.log("   -> User Stats Updated");

		// 8. Calculate Score
		console.log("   -> Triggering Calculation...");
		await calculateScore(bookId);
		console.log("   -> Calculation Done");

		res.status(201).json(review);
	} catch (error) {
		console.error("❌ CRITICAL SERVER ERROR:", error);
		// Send the actual error message to the frontend so we can see it
		res.status(500).json({ message: error.message || "Internal Server Error" });
	}
};

export const approveReview = async (req, res) => {
	try {
		const review = await Review.findByIdAndUpdate(
			req.params.id,
			{
				status: "approved",
				moderatedBy: req.user._id,
				moderatedAt: new Date(),
			},
			{ new: true }
		);

		if (!review) return res.status(404).json({ message: "Review not found" });

		if (review.role === "student" && !review.rewardGiven) {
			await User.findByIdAndUpdate(review.userId, {
				$inc: { credits: 10, "stats.reviewsApproved": 1 },
			});
			await CreditHistory.create({
				userId: review.userId,
				reviewId: review._id,
				points: 10,
				action: "review_approved",
				description: "Credits for approved review",
			});
			review.rewardGiven = true;
			await review.save();
		}

		await calculateScore(review.bookId);
		res.json(review);
	} catch (error) {
		res.status(500).json({ message: "Error approving review" });
	}
};

export const rejectReview = async (req, res) => {
	try {
		const review = await Review.findByIdAndUpdate(
			req.params.id,
			{
				status: "rejected",
				moderatedBy: req.user._id,
				moderatedAt: new Date(),
			},
			{ new: true }
		);
		res.json(review);
	} catch (error) {
		res.status(500).json({ message: "Error rejecting review" });
	}
};

export const getBookReviews = async (req, res) => {
	try {
		const bookId = req.params.id;

		const book = await Book.findById(bookId);
		if (!book) return res.status(404).json({ message: "Book not found" });

		const reviews = await Review.find({ bookId: bookId })
			.populate("userId", "name role")
			.sort({ createdAt: -1 });

		res.json(reviews);
	} catch (error) {
		res.status(500).json({ message: "Error fetching reviews" });
	}
};

export const getPendingReviews = async (req, res) => {
	try {
		const reviews = await Review.find({ status: "pending" })
			.populate("userId", "name role")
			.populate("bookId", "title");

		res.json(reviews);
	} catch (error) {
		res.status(500).json({ message: "Error fetching pending reviews" });
	}
};
