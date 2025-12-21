import Criteria from "../models/Criteria.js";

// --- CREATE CRITERIA (For Admin) ---
export const createCriteria = async (req, res) => {
	try {
		const { name, role, weight } = req.body;

		const criteria = await Criteria.create({
			name,
			role,
			weight: weight || 1,
			isActive: true,
		});

		res.status(201).json(criteria);
	} catch (error) {
		res.status(500).json({ message: "Error creating criteria" });
	}
};

// --- GET CRITERIA (For the Review Form) ---
export const getCriteriaByRole = async (req, res) => {
	try {
		const { role } = req.params;
		// Only fetch active criteria
		const criteria = await Criteria.find({ role: role, isActive: true });
		res.json(criteria);
	} catch (error) {
		res.status(500).json({ message: "Error fetching criteria" });
	}
};

// --- SEED DEFAULTS (Run once to fix empty database) ---
export const seedCriteria = async (req, res) => {
	try {
		// 1. Clear existing
		await Criteria.deleteMany({});

		// 2. Define Defaults
		const defaults = [
			// Student Criteria
			{ name: "Readability", role: "student", weight: 1, isActive: true },
			{ name: "Engagement", role: "student", weight: 1, isActive: true },
			{ name: "Examples", role: "student", weight: 1, isActive: true },

			// Teacher Criteria
			{ name: "Accuracy", role: "teacher", weight: 2, isActive: true },
			{ name: "Depth", role: "teacher", weight: 2, isActive: true },
			{ name: "Structure", role: "teacher", weight: 1, isActive: true },
		];

		// 3. Insert
		await Criteria.insertMany(defaults);

		res.json({ message: "Criteria initialized successfully!", data: defaults });
	} catch (error) {
		res.status(500).json({ message: "Error seeding criteria" });
	}
};
