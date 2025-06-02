import "./share.scss";

import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../../../axios";
import CloseIcon from "@mui/icons-material/Close";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const { currentUser, DEFAULT_PROFILE_PICTURE } = useContext(AuthContext);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeImage = () => {
    setFile(null);
    setImagePreview(null);
  };

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData);
      return res.data;
    } catch (error) {
      toast.error("Error uploading file");
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return api.post("/posts", newPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully!", {});
      setDesc("");
      setFile(null);
      setImagePreview(null);
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      setDesc("");
      toast.error("Failed to create post. Please try again later.", {});
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) {
      const res = await upload(file);
      imgUrl = res.file.filename;
    }
    if (!desc.trim()) {
      toast.error("Post cannot be empty.", {});
      return;
    }
    mutation.mutate({
      desc,
      img: imgUrl,
    });
  };

  const handleImageClick = () => {
    setShowFullPreview(true);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img
            src={
              currentUser.profilePicture
                ? `/uploads/${currentUser.profilePicture}`
                : DEFAULT_PROFILE_PICTURE
            }
            alt=""
          />
          <textarea
            placeholder={`What's on your mind ${currentUser.name}?`}
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
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
        </div>
        {imagePreview && (
          <div className="imagePreviewContainer">
            <img src={imagePreview} alt="Preview" onClick={handleImageClick} />
            <button className="removeImage" onClick={removeImage}>
              <CloseIcon />
            </button>
          </div>
        )}
        {showFullPreview && (
          <div
            className="fullImagePreview"
            onClick={() => setShowFullPreview(false)}
          >
            <CloseIcon className="closeIcon" />
            <img src={imagePreview} alt="" />
          </div>
        )}
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*"
            />
            <label htmlFor="file">
              <div className="item">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1829/1829589.png"
                  alt=""
                />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img
                src="https://cdn-icons-png.flaticon.com/512/5088/5088218.png"
                alt=""
              />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4951/4951182.png"
                alt=""
              />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
