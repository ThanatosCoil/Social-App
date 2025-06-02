import express from "express";
import {
  getPosts,
  addPost,
  deletePost,
  updatePost,
  getAllPosts,
  searchPosts,
} from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);
router.get("/all", getAllPosts);
router.get("/search", searchPosts);

export default router;
