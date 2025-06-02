import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;

  const q = "SELECT * FROM users WHERE id = ?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { ...info } = data[0];
    return res.status(200).json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `name`=?, `city`=?, `website`=?, `coverPicture`=?, `profilePicture`=? WHERE id=?";

    const values = [
      req.body.name,
      req.body.city,
      req.body.website,
      req.body.coverPicture,
      req.body.profilePicture,
      userInfo.id,
    ];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json(err);
      }
      if (data.affectedRows > 0)
        return res.status(200).json("User has been updated.");
      return res.status(403).json("You can update only your account!");
    });
  });
};
