import mongoose from "mongoose";

const criteriaSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		role: { type: String, enum: ["student", "teacher"], required: true },
		weight: { type: Number, default: 1 },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

export default mongoose.model("Criteria", criteriaSchema);
