import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = userId
      ? `SELECT p.*, u.id AS userId, name, profilePicture
      FROM posts AS p
      JOIN users AS u ON (u.id = p.userId)
      WHERE p.userId = ?
      ORDER BY p.createdAt DESC`
      : `SELECT DISTINCT p.*, u.id AS userId, u.name, u.profilePicture
      FROM posts AS p
      JOIN users AS u ON (u.id = p.userId)
      LEFT JOIN relationships AS r ON (p.userId = r.followedUserId AND r.followerUserId = ?)
      LEFT JOIN likes AS l ON (p.id = l.postId AND l.userId = ?)
      WHERE r.followerUserId IS NOT NULL OR p.userId = ? OR l.userId IS NOT NULL
      ORDER BY p.createdAt DESC`;

    const values = userId ? [userId] : [userInfo.id, userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};

export const deletePost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your posts!");
    });
  });
};

export const updatePost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "UPDATE posts SET `desc` = ? WHERE `id` = ? AND `userId` = ?";
    db.query(q, [req.body.desc, req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been updated.");
      return res.status(403).json("You can update only your posts!");
    });
  });
};

export const getAllPosts = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT p.*, u.id AS userId, name, profilePicture FROM posts AS p JOIN users AS u ON (u.id = p.userId)
      ORDER BY p.createdAt DESC`;

    db.query(q, [], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const searchPosts = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  const { query } = req.query;
  if (!query || query.trim() === "") {
    return res.status(400).json("Query is required");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT p.*, u.id AS userId, u.name, u.profilePicture
      FROM posts AS p
      JOIN users AS u ON (u.id = p.userId)
      WHERE LOWER(p.desc) LIKE ? OR LOWER(u.name) LIKE ?
      ORDER BY p.createdAt DESC`;
    const likeQuery = `%${query.toLowerCase()}%`;
    db.query(q, [likeQuery, likeQuery], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
