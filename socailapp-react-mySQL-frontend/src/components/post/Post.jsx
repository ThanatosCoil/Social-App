import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router";
import { useContext, useState, useRef, useEffect } from "react";
import Comments from "../comments/Comments";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../axios";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

const Post = ({ post }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, DEFAULT_PROFILE_PICTURE } = useContext(AuthContext);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDesc, setEditDesc] = useState(post.desc);

  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () =>
      api.get(`/likes?postId=${post.id}`).then((res) => {
        return res.data;
      }),
    staleTime: 10000,
    cacheTime: 300000,
  });

  const { isLoading: isLoadingComments, data: commentsData } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () =>
      api.get(`/comments?postId=${post.id}`).then((res) => {
        return res.data;
      }),
    staleTime: 10000,
    cacheTime: 300000,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) {
        return api.delete("/likes?postId=" + post.id);
      } else {
        return api.post("/likes", { postId: post.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Error liking post:", error);
      toast.error("Failed to like post. Please try again later.", {});
    },
  });

  const editMutation = useMutation({
    mutationFn: (newDesc) => api.put(`/posts/${post.id}`, { desc: newDesc }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post updated successfully.", {});
      setShowEditModal(false);
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again later.", {});
    },
  });

  const handleLike = async (e) => {
    e.preventDefault();
    mutation.mutate(data.some((like) => like.userId === currentUser.id));
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    editMutation.mutate(editDesc);
  };

  const deleteMutation = useMutation({
    mutationFn: (postId) => {
      return api.delete("/posts/" + postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully.", {});
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again later.", {});
    },
  });

  const handleDelete = async (e) => {
    e.preventDefault();
    deleteMutation.mutate(post.id);
  };

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".moreIcon")
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <Link to={`/profile/${post.userId}`}>
              <img
                src={
                  post.profilePicture
                    ? `/uploads/${post.profilePicture}`
                    : DEFAULT_PROFILE_PICTURE
                }
                alt=""
              />
            </Link>
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          {post.userId === currentUser.id && (
            <>
              <MoreHorizIcon
                className="moreIcon"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
              />
              {menuOpen && (
                <div className="menu" ref={menuRef}>
                  <span onClick={() => setShowDeleteConfirm(true)}>Delete</span>
                  <span
                    onClick={() => {
                      setEditDesc(post.desc);
                      setShowEditModal(true);
                      setMenuOpen(false);
                    }}
                  >
                    Edit
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          {post.img && (
            <img
              src={`/uploads/${post.img}`}
              alt=""
              onClick={() => setShowPreview(true)}
            />
          )}
        </div>
        <div className="info">
          <div className="item" onClick={handleLike}>
            {isLoading ? (
              ""
            ) : data.some((like) => like.userId === currentUser.id) ? (
              <FavoriteOutlinedIcon className="likeIcon" />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
            <span>{isLoading ? "" : data.length}</span>
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            <span>{isLoadingComments ? "" : commentsData.length}</span>
          </div>
          <div className="item">
            <ShareOutlinedIcon />
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>

      {showPreview && (
        <div className="imagePreview" onClick={() => setShowPreview(false)}>
          <CloseIcon className="closeIcon" />
          <img src={`/uploads/${post.img}`} alt="" />
        </div>
      )}

      {showDeleteConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Are you sure you want to delete this post?</h3>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="delete-btn"
                onClick={(e) => {
                  setShowDeleteConfirm(false);
                  handleDelete(e);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Post</h3>
            <form onSubmit={handleEditSave} className="edit-form">
              <textarea
                className="edit-textarea"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={4}
                maxLength={500}
                required
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="delete-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Post;
