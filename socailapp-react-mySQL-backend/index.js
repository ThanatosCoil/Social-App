import express from "express";
import usersRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js";
import likesRoutes from "./routes/likes.js";
import commentsRoutes from "./routes/comments.js";
import relationshipsRoutes from "./routes/relationships.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();

//middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(cookieParser());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/relationships", relationshipsRoutes);

app.listen(process.env.PORT || 8800, () => {
  console.log(`Server is running on port ${process.env.PORT || 8800}`);
});
