import mongoose from "mongoose";

const creditHistorySchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		reviewId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review",
		},

		points: {
			type: Number,
			required: true,
		},

		action: {
			type: String,
			enum: ["review_approved", "bonus", "penalty"],
			required: true,
		},

		description: {
			type: String,
			trim: true,
		},
	},
	{ timestamps: true }
);

creditHistorySchema.index({ userId: 1 });

export default mongoose.model("CreditHistory", creditHistorySchema);
