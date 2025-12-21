import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
	criteriaId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Criteria", // Ensure this matches your Criteria model name
		required: true,
	},
	value: {
		type: Number,
		required: true,
	},
});

const Score = mongoose.models.Score || mongoose.model("Score", scoreSchema);
export default Score;
