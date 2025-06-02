import express from "express";
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.js";

const router = express.Router();

router.get("/", getComments);
router.post("/", addComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
