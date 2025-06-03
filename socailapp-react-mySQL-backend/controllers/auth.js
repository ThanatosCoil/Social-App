import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  try {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json("Invalid email format");
    }

    // Password length check
    if (req.body.password.length < 6) {
      return res
        .status(400)
        .json("Password must be at least 6 characters long");
    }

    //check if user already exists
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
      if (err) {
        console.error("DB error on user check:", err);
        return res
          .status(500)
          .json({ error: "DB error on user check", details: err });
      }
      if (data.length > 0) return res.status(400).json("User already exists");

      //create a new user
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);
      const q =
        "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?)";
      const values = [
        req.body.username,
        req.body.email,
        hashedPassword,
        req.body.name,
      ];
      db.query(q, [values], (err, data) => {
        if (err) {
          console.error("DB error on user insert:", err);
          return res
            .status(500)
            .json({ error: "DB error on user insert", details: err });
        }
        return res.status(200).json("User created successfully");
      });
    });
  } catch (err) {
    console.error("Register controller error:", err);
    return res
      .status(500)
      .json({ error: "Register controller error", details: err.message });
  }
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkPassword) return res.status(400).json("Wrong password or email");

    const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET);

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User logged out");
};
