import mongoose from "mongoose";

const computedScoreSchema = new mongoose.Schema(
	{
		bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", unique: true },
		studentAvg: { type: Number, default: 0 },
		teacherAvg: { type: Number, default: 0 },
		finalScore: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

export default mongoose.model("ComputedScore", computedScoreSchema);
