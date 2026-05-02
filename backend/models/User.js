import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		regNumber: { type: String, required: true },

		password: {
			type: String,
			required: true,
		},

		role: {
			type: String,
			enum: ["student", "teacher", "admin"],
			required: true,
		},

		isVerified: {
			type: Boolean,
			default: false,
		},

		credits: {
			type: Number,
			default: 0,
			min: 0,
		},

		stats: {
			reviewsSubmitted: {
				type: Number,
				default: 0,
			},
			reviewsApproved: {
				type: Number,
				default: 0,
			},
		},

		isActive: {
			type: Boolean,
			default: true,
		},

		lastLogin: {
			type: Date,
		},
	},
	{ timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
