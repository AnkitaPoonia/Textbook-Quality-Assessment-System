import Book from "../models/Book.js";
import Review from "../models/Review.js";
import Criteria from "../models/Criteria.js";
import ComputedScore from "../models/ComputedScore.js";

export const calculateScore = async (bookId) => {
	try {
		console.log(`🧮 START CALCULATION for Book: ${bookId}`);

		// 1. Get all APPROVED reviews
		const reviews = await Review.find({
			bookId: bookId,
			status: "approved",
		}).populate("scores");

		if (!reviews || reviews.length === 0) {
			await Book.findByIdAndUpdate(bookId, {
				finalScore: 0,
				studentAvg: 0,
				teacherAvg: 0,
				scoreBreakdown: [],
			});
			return;
		}

		// 2. Setup Variables
		let totalSum = 0;
		let totalCount = 0;

		// Variables for Split Averages
		let studentSum = 0;
		let studentCount = 0;
		let teacherSum = 0;
		let teacherCount = 0;

		const criteriaMap = {};

		// 3. Loop through Reviews
		for (const review of reviews) {
			if (review.scores && Array.isArray(review.scores)) {
				// Calculate average for THIS specific review to determine role-based stats
				let reviewTotal = 0;
				let reviewItems = 0;

				for (const s of review.scores) {
					if (!s || typeof s.value !== "number") continue;

					// Global stats
					totalSum += s.value;
					totalCount++;

					// Local review stats
					reviewTotal += s.value;
					reviewItems++;

					// Per-Criteria stats
					const cId = s.criteriaId ? s.criteriaId.toString() : null;
					if (cId) {
						if (!criteriaMap[cId]) {
							criteriaMap[cId] = { sum: 0, count: 0 };
						}
						criteriaMap[cId].sum += s.value;
						criteriaMap[cId].count++;
					}
				}

				// Add to Student/Teacher Specific Totals
				if (reviewItems > 0) {
					const thisReviewAvg = reviewTotal / reviewItems;

					if (review.role === "student") {
						studentSum += thisReviewAvg;
						studentCount++;
					} else if (review.role === "teacher" || review.role === "admin") {
						teacherSum += thisReviewAvg;
						teacherCount++;
					}
				}
			}
		}

		// 4. Compute Final Averages
		const finalScore = totalCount > 0 ? totalSum / totalCount : 0;
		const finalStudentAvg = studentCount > 0 ? studentSum / studentCount : 0;
		const finalTeacherAvg = teacherCount > 0 ? teacherSum / teacherCount : 0;

		// 5. Compute Breakdown (Readability, Language, etc.)
		const breakdown = [];
		const criteriaIds = Object.keys(criteriaMap);
		const criteriaDocs = await Criteria.find({ _id: { $in: criteriaIds } });
		const nameMap = {};

		criteriaDocs.forEach((c) => {
			nameMap[c._id.toString()] = c.name;
		});

		criteriaIds.forEach((id) => {
			const data = criteriaMap[id];
			if (nameMap[id] && data.count > 0) {
				breakdown.push({
					criteriaName: nameMap[id],
					average: data.sum / data.count,
				});
			}
		});

		// 6. Save Everything to Database
		await Book.findByIdAndUpdate(bookId, {
			finalScore: finalScore,
			studentAvg: finalStudentAvg, // 👈 Saving New Field
			teacherAvg: finalTeacherAvg, // 👈 Saving New Field
			scoreBreakdown: breakdown,
		});

		console.log(
			`✅ Updated: Score=${finalScore.toFixed(
				1
			)}, Student=${finalStudentAvg.toFixed(
				1
			)}, Teacher=${finalTeacherAvg.toFixed(1)}`
		);
	} catch (error) {
		console.error("❌ Error calculating score:", error);
	}
};
