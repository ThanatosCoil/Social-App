import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import "./comments.scss";
import SendIcon from "@mui/icons-material/Send";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../axios";
import moment from "moment";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { isLoading, error, data } = useQuery({
    queryKey: ["comments"],
    queryFn: () =>
      api.get(`/comments?postId=${postId}`).then((res) => {
        return res.data;
      }),
  });
  const { currentUser, DEFAULT_PROFILE_PICTURE } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment) => {
      return api.post("/comments", newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setDesc("");
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
      setDesc("");
      toast.error("Failed to create comment. Please try again later.", {});
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, desc }) => api.put(`/comments/${id}`, { desc }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setEditCommentId(null);
      setEditCommentDesc("");
    },
    onError: (error) => {
      toast.error("Failed to update comment. Please try again later.", {});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/comments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      toast.error("Failed to delete comment. Please try again later.", {});
    },
  });

  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentDesc, setEditCommentDesc] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleClick = async (e) => {
    e.preventDefault();

    if (!desc.trim()) {
      toast.error("Comment cannot be empty.", {});
      return;
    }
    mutation.mutate({
      desc,
      postId,
    });
  };

  const handleEditStart = (comment) => {
    setEditCommentId(comment.id);
    setEditCommentDesc(comment.desc);
  };
  const handleEditCancel = () => {
    setEditCommentId(null);
    setEditCommentDesc("");
  };
  const handleEditSave = (id) => {
    if (!editCommentDesc.trim()) {
      toast.error("Comment cannot be empty.", {});
      return;
    }
    updateMutation.mutate({ id, desc: editCommentDesc });
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="comments">
      <div className="write">
        <img
          src={
            currentUser.profilePicture
              ? `/uploads/${currentUser.profilePicture}`
              : DEFAULT_PROFILE_PICTURE
          }
          alt=""
        />
        <textarea
          placeholder="write a comment..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onInput={(e) => {
            e.target.style.height = "auto";
            const newHeight = Math.min(e.target.scrollHeight, 150);
            e.target.style.height = newHeight + "px";

            if (e.target.scrollHeight > 150) {
              e.target.style.overflowY = "auto";
            } else {
              e.target.style.overflowY = "hidden";
            }
          }}
        />
        <button onClick={handleClick}>
          <SendIcon className="sendIcon" />
        </button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((comment) => (
            <div className="comment" key={comment.id}>
              <img
                src={
                  comment.profilePicture
                    ? `/uploads/${comment.profilePicture}`
                    : DEFAULT_PROFILE_PICTURE
                }
                alt=""
              />
              <div className="info">
                <span>{comment.name}</span>
                {editCommentId === comment.id ? (
                  <>
                    <textarea
                      className="edit-comment-textarea"
                      value={editCommentDesc}
                      onChange={(e) => setEditCommentDesc(e.target.value)}
                      rows={2}
                      maxLength={300}
                      autoFocus
                    />
                    <div className="comment-actions">
                      <button
                        className="save-btn"
                        onClick={() => handleEditSave(comment.id)}
                      >
                        Save
                      </button>
                      <button className="cancel-btn" onClick={handleEditCancel}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <p>{comment.desc}</p>
                )}
              </div>
              <span className="date">
                {moment(comment.createdAt).fromNow()}
              </span>
              {comment.userId === currentUser.id &&
                editCommentId !== comment.id && (
                  <div className="comment-menu">
                    <EditIcon
                      className="edit-icon"
                      onClick={() => handleEditStart(comment)}
                    />
                    <DeleteIcon
                      className="delete-icon"
                      onClick={() => setDeleteConfirmId(comment.id)}
                    />
                  </div>
                )}
              {deleteConfirmId === comment.id && (
                <div
                  className="modal-overlay"
                  onClick={() => setDeleteConfirmId(null)}
                >
                  <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <h3>Delete this comment?</h3>
                    <div className="modal-actions">
                      <button
                        className="cancel-btn"
                        onClick={() => setDeleteConfirmId(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(comment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
    </div>
  );
};
export default Comments;
