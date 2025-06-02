import CloseIcon from "@mui/icons-material/Close";
import "./update.scss";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import api from "../../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";

const Update = ({ setUpdate, user }) => {
  const { updateCurrentUser } = useContext(AuthContext);
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    name: user.name,
    city: user.city,
    website: user.website,
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData);
      return res.data.file.filename;
    } catch (error) {
      toast.error("Error uploading file");
    }
  };

  const handleChange = (e) => {
    setTexts({ ...texts, [e.target.name]: e.target.value });
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (user) => {
      return api.put("/users", user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("User updated successfully!", {});
      setUpdate(false);
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again later.", {});
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;

    try {
      if (cover) {
        coverUrl = await upload(cover);
      }
      if (profile) {
        profileUrl = await upload(profile);
      }

      const updatedUser = {
        ...texts,
        coverPicture: coverUrl || user.coverPicture || "",
        profilePicture: profileUrl || user.profilePicture || "",
      };

      mutation.mutate(updatedUser);
      updateCurrentUser({
        ...user,
        ...updatedUser,
      });
    } catch (error) {
      toast.error("Error updating profile");
      console.error(error);
    }
  };

  return (
    <>
      <div className="overlay" onClick={() => setUpdate(false)} />
      <div className="update">
        <h2>Update Your Profile</h2>
        <form>
          <input type="file" onChange={(e) => setCover(e.target.files[0])} />
          <input type="file" onChange={(e) => setProfile(e.target.files[0])} />
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
          />
          <input
            type="text"
            name="website"
            placeholder="Website"
            onChange={handleChange}
          />
          <button onClick={handleSubmit}>Update</button>
        </form>
        <div className="close" onClick={() => setUpdate(false)}>
          <CloseIcon />
        </div>
      </div>
    </>
  );
};
export default Update;
