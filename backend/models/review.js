import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
	{
		bookId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Book",
			required: true,
		},

		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		role: {
			type: String,
			enum: ["student", "teacher"],
			required: true,
		},

		scores: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Score",
				required: true,
			},
		],

		comment: {
			type: String,
			trim: true,
			maxlength: 2000,
		},

		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
		},

		moderatedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},

		moderatedAt: {
			type: Date,
		},

		rewardGiven: {
			type: Boolean,
			default: false,
		},

		isEdited: {
			type: Boolean,
			default: false,
		},
		comment: { type: String, trim: true },
	},
	{ timestamps: true }
);

reviewSchema.index({ bookId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ status: 1 });

export default mongoose.model("Review", reviewSchema);
