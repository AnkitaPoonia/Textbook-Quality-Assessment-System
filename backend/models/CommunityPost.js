import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema(
	{
		title: { type: String, required: true }, // The "Front Page" / Header
		content: { type: String, required: true },
		imageUrl: { type: String }, // The "Poster"
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		// Admin Approval System
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
		},

		// Real Like Count
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

		// Structured Comments
		comments: [
			{
				user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				text: { type: String, required: true },
				createdAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("CommunityPost", communityPostSchema);
