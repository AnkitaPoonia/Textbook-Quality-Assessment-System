import express from "express";
import {
	createCriteria,
	getCriteriaByRole,
	seedCriteria, // 👈 Added import
} from "../controllers/criteriaController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createCriteria);

router.get("/:role", protect, getCriteriaByRole);

router.post("/seed", seedCriteria);

export default router;
