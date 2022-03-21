const express = require("express");
const PostController = require("../controllers/posts");

const router = express.Router();
const postController = new PostController();

router.get("/homePost", postController.getPostsView);
router.get("/createPost", postController.getCreatePost);
router.post("/createPost", postController.createPost);

module.exports = router;
