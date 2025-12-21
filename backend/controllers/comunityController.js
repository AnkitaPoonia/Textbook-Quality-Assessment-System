import CommunityPost from "../models/CommunityPost.js";

// Create Post (With Image)
export const createPost = async (req, res) => {
	try {
		console.log("Received Post Request");
		console.log("Body:", req.body);
		console.log("File:", req.file);

		const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

		const post = await CommunityPost.create({
			title: req.body.title,
			content: req.body.content,
			imageUrl: imageUrl,
			author: req.user._id, // This requires the user to be logged in
			status: "pending",
		});

		console.log("Post Created Successfully:", post);
		res.status(201).json(post);
	} catch (error) {
		console.error("❌ Error creating post:", error); // This prints the real error
		res.status(500).json({ message: error.message || "Error creating post" });
	}
};
// 👇 DELETE POST
export const deletePost = async (req, res) => {
	try {
		const post = await CommunityPost.findById(req.params.id);
		if (!post) return res.status(404).json({ message: "Post not found" });

		// Check: Admin OR Owner
		if (
			req.user.role !== "admin" &&
			post.author.toString() !== req.user._id.toString()
		) {
			return res.status(403).json({ message: "Not authorized" });
		}

		await post.deleteOne();
		res.json({ message: "Post deleted" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting post" });
	}
};
// 👇 UPDATE COMMENT (New)
export const updateComment = async (req, res) => {
	try {
		const { postId, commentId } = req.params;

		const post = await CommunityPost.findById(postId);
		if (!post) return res.status(404).json({ message: "Post not found" });

		// Find the specific comment
		const comment = post.comments.id(commentId);
		if (!comment) return res.status(404).json({ message: "Comment not found" });

		// Check Auth: Only the comment author can edit
		if (comment.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Not authorized" });
		}

		// Update text
		comment.text = req.body.text;
		await post.save();

		// Return updated comments list
		const updatedPost = await CommunityPost.findById(postId).populate(
			"comments.user",
			"name"
		);
		res.json(updatedPost.comments);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error updating comment" });
	}
};
export const rejectPost = async (req, res) => {
	try {
		const post = await CommunityPost.findByIdAndUpdate(
			req.params.id,
			{ status: "rejected" },
			{ new: true }
		);
		res.json(post);
	} catch (error) {
		res.status(500).json({ message: "Error rejecting post" });
	}
};
export const updatePost = async (req, res) => {
	try {
		const post = await CommunityPost.findById(req.params.id);
		if (!post) return res.status(404).json({ message: "Post not found" });

		if (
			req.user.role !== "admin" &&
			post.author.toString() !== req.user._id.toString()
		) {
			return res.status(403).json({ message: "Not authorized" });
		}

		post.title = req.body.title || post.title;
		post.content = req.body.content || post.content;
		await post.save();

		res.json(post);
	} catch (error) {
		res.status(500).json({ message: "Error updating post" });
	}
};
// ... keep getPosts, toggleLike, addComment as they were ...
export const getPosts = async (req, res) => {
	try {
		const posts = await CommunityPost.find({ status: "approved" })
			.sort({ createdAt: -1 })
			.populate("author", "name role regNumber")
			.populate("comments.user", "name");
		res.json(posts);
	} catch (error) {
		res.status(500).json({ message: "Error fetching posts" });
	}
};

export const toggleLike = async (req, res) => {
	try {
		const post = await CommunityPost.findById(req.params.id);
		if (post.likes.includes(req.user._id)) {
			post.likes.pull(req.user._id);
		} else {
			post.likes.push(req.user._id);
		}
		await post.save();
		res.json(post.likes);
	} catch (error) {
		res.status(500).json({ message: "Error liking post" });
	}
};

export const addComment = async (req, res) => {
	try {
		const post = await CommunityPost.findById(req.params.id);
		post.comments.push({
			user: req.user._id,
			text: req.body.text,
		});
		await post.save();
		// Return only the updated comments array (populated)
		const updatedPost = await CommunityPost.findById(req.params.id).populate(
			"comments.user",
			"name"
		);
		res.json(updatedPost.comments);
	} catch (error) {
		res.status(500).json({ message: "Error adding comment" });
	}
};
export const getPendingPosts = async (req, res) => {
	try {
		const posts = await CommunityPost.find({ status: "pending" }).populate(
			"author",
			"name role regNumber"
		);
		res.json(posts);
	} catch (error) {
		res.status(500).json({ message: "Error fetching pending posts" });
	}
};

export const approvePost = async (req, res) => {
	try {
		const post = await CommunityPost.findByIdAndUpdate(
			req.params.id,
			{ status: "approved" },
			{ new: true }
		);
		res.json(post);
	} catch (error) {
		res.status(500).json({ message: "Error approving post" });
	}
};
