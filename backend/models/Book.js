import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		author: { type: String, required: true },
		edition: { type: String },
		subject: { type: String, required: true },
		semester: { type: Number },
		level: { type: String, enum: ["UG", "PG"] },
		format: { type: String, enum: ["textbook", "reference", "ebook"] },
		pdfUrl: { type: String },
		isLibraryBook: { type: Boolean, default: false },

		
		// 👇 NEW FIELDS ADDED HERE
		finalScore: { type: Number, default: 0 },
		studentAvg: { type: Number, default: 0 }, // Store Student Score
		teacherAvg: { type: Number, default: 0 }, // Store Teacher Score

		scoreBreakdown: [
			{
				criteriaName: String,
				average: Number,
			},
		],
		coverImage: {
			type: String,
			default: null,
		},

		addedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Book", bookSchema);
