import Book from "../models/Book.js";
import ComputedScore from "../models/ComputedScore.js";
import { calculateScore } from "./scoreController.js";
import Review from "../models/Review.js";

export const updateBook = async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		if (!book) return res.status(404).json({ message: "Book not found" });

		// Authorization: Admin or Owner
		if (
			req.user.role !== "admin" &&
			book.addedBy.toString() !== req.user._id.toString()
		) {
			return res.status(403).json({ message: "Not authorized" });
		}

		const updatedBook = await Book.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body }, // Updates all fields sent from the form
			{ new: true }
		);
		res.json(updatedBook);
	} catch (error) {
		res.status(500).json({ message: "Error updating book" });
	}
};

export const deleteBook = async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		if (!book) return res.status(404).json({ message: "Book not found" });

		// Check: Admin OR Owner
		if (
			req.user.role !== "admin" &&
			book.addedBy.toString() !== req.user._id.toString()
		) {
			return res
				.status(403)
				.json({ message: "Not authorized to delete this book" });
		}

		await book.deleteOne();
		res.json({ message: "Book removed" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting book" });
	}
};

export const debugBookScore = async (req, res) => {
	try {
		const bookId = req.params.id;
		console.log(`\n🕵️‍♂️ DEBUGGING & FIXING BOOK: ${bookId}`);

		// 1. Check Reviews
		const approvedReviews = await Review.find({
			bookId,
			status: "approved",
		}).populate("scores");

		if (approvedReviews.length === 0) {
			return res.json({
				message: "❌ No approved reviews found to calculate.",
			});
		}

		console.log(
			`✅ Found ${approvedReviews.length} approved reviews. Running calculation...`
		);

		// 👇 2. FORCE CALCULATION NOW
		await calculateScore(bookId);

		// 3. Check Result
		const updatedBook = await Book.findById(bookId);
		console.log(`🎉 New Score Saved: ${updatedBook.finalScore}`);

		res.json({
			message: "Calculation executed successfully!",
			previousScore: "Was 0 (likely)",
			newScore: updatedBook.finalScore,
			studentAvg: updatedBook.studentAvg,
			teacherAvg: updatedBook.teacherAvg,
		});
	} catch (error) {
		console.error("Debug Error:", error);
		res.status(500).json(error);
	}
};
export const createBook = async (req, res) => {
	const pdfUrl = req.files?.pdf
		? `/uploads/${req.files.pdf[0].filename}`
		: null;

	const coverImage = req.files?.cover
		? `/uploads/${req.files.cover[0].filename}`
		: null;

	const doc = await Book.create({
		...req.body,
		addedBy: req.user._id,
		pdfUrl: pdfUrl,
		coverImage: coverImage, // 👈 added, optional
	});

	res.status(201).json(doc);
};

export const getBooks = async (req, res) => {
	try {
		const { search } = req.query;

		const baseQuery = { status: "approved" };

		if (search && search.trim()) {
			const regex = new RegExp(search.trim(), "i");

			baseQuery.$or = [
				{ title: regex },
				{ author: regex },
				{ subject: regex },
				{ edition: regex },
				{ format: regex },
				{ level: regex },
			];
		}

		const books = await Book.find(baseQuery)
			.populate("addedBy", "role")
			.sort({ createdAt: -1 })
			.lean();

		res.json(books);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to fetch books" });
	}
};

export const getPendingBooks = async (req, res) => {
	const books = await Book.find({ status: "pending" }).populate(
		"addedBy",
		"name email"
	);
	res.json(books);
};

export const getBookById = async (req, res) => {
	try {
		const book = await Book.findById(req.params.id).populate("addedBy", "name");

		if (!book) {
			return res.status(404).json({ message: "Book not found" });
		}

		res.json({ book });
	} catch (error) {
		res.status(500).json({ message: "Error fetching book details" });
	}
};

export const approveBook = async (req, res) => {
	const book = await Book.findByIdAndUpdate(
		req.params.id,
		{ status: "approved" },
		{ new: true }
	);
	res.json(book);
};

export const rejectBook = async (req, res) => {
	const book = await Book.findByIdAndUpdate(
		req.params.id,
		{ status: "rejected" },
		{ new: true }
	);
	res.json(book);
};
