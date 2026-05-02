import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "./models/Book.js";
import User from "./models/user.js";

dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose
	.connect(process.env.MONGO_URI)
	.then(async () => {
		console.log("Connected to MongoDB...");
		console.log("MONGO_URI:", process.env.MONGO_URI);
		// 1. Find the first user to be the "owner" of these books
		const user = await User.findOne();
		if (!user) {
			console.log(
				"Error: Please create at least one user (Signup) on the website first."
			);
			process.exit();
		}

		// 2. Clear existing books (Optional - remove if you want to keep yours)
		await Book.deleteMany({});

		// 3. Add Sample Books
		const books = [
			{
				title: "Introduction to Algorithms",
				author: "Thomas H. Cormen",
				subject: "Computer Science",
				edition: "4th Edition",
				level: "UG",
				format: "textbook",
				status: "approved", // Auto-approved
				addedBy: user._id,
			},
			{
				title: "Clean Code",
				author: "Robert C. Martin",
				subject: "Software Engineering",
				edition: "1st Edition",
				level: "UG",
				format: "reference",
				status: "approved",
				addedBy: user._id,
			},
			{
				title: "Organic Chemistry",
				author: "Paula Yurkanis Bruice",
				subject: "Chemistry",
				edition: "8th Edition",
				level: "UG",
				format: "textbook",
				status: "approved",
				addedBy: user._id,
			},
		];

		await Book.insertMany(books);
		console.log("✅ 3 Sample Books Added!");
		process.exit();
	})
	.catch((err) => {
		console.error(err);
		process.exit();
	});
