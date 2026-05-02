import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import criteriaRoutes from "./routes/criteriaRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import upload from "./middleware/uploadMiddleware.js";
import {
	createPost,
	getPosts,
	toggleLike,
	addComment,
	getPendingPosts,
	approvePost,
	deletePost,
	updatePost,
	updateComment,
	rejectPost,
} from "./controllers/comunityController.js";
import { protect } from "./middleware/authMiddleware.js";
import { authorize } from "./middleware/roleMiddleware.js";
dotenv.config();

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

// handle preflight
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));
const communityRouter = express.Router();
communityRouter.post("/", protect, upload.single("image"), createPost);
communityRouter.get("/", protect, getPosts);
communityRouter.put("/:postId/comment/:commentId", protect, updateComment);
communityRouter.delete("/:id", protect, deletePost);
communityRouter.put("/:id", protect, updatePost);
communityRouter.put("/:id/like", protect, toggleLike);
communityRouter.post("/:id/comment", protect, addComment);
communityRouter.put("/:id/reject", protect, authorize("admin"), rejectPost);
communityRouter.get("/pending", protect, authorize("admin"), getPendingPosts);
communityRouter.put("/:id/approve", protect, authorize("admin"), approvePost);
app.use("/api/community", communityRouter);

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/criteria", criteriaRoutes);
app.use("/api/reviews", reviewRoutes);

app.use((req, res, next) => {
	res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
	const status = err.status || 500;
	res.status(status).json({ message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
	await mongoose.connect(process.env.MONGO_URI);

	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
};

start();
