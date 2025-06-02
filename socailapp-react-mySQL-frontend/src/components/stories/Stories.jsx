import { useContext } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const Stories = () => {
  const stories = [
    {
      id: 1,
      name: "John Doe",
      img: "https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhvdG9ncmFwaGVyfGVufDB8fDB8fHww",
    },
    {
      id: 2,
      name: "John Doe",
      img: "https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhvdG9ncmFwaGVyfGVufDB8fDB8fHww",
    },
    {
      id: 3,
      name: "John Doe",
      img: "https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhvdG9ncmFwaGVyfGVufDB8fDB8fHww",
    },
    {
      id: 4,
      name: "John Doe",
      img: "https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhvdG9ncmFwaGVyfGVufDB8fDB8fHww",
    },
  ];
  const { currentUser, DEFAULT_PROFILE_PICTURE } = useContext(AuthContext);
  return (
    <div className="stories">
      <div className="story">
        <img
          src={
            currentUser.profilePicture
              ? `/uploads/${currentUser.profilePicture}`
              : DEFAULT_PROFILE_PICTURE
          }
          alt=""
        />
        <span>{currentUser.name}</span>
        <button>
          <AddOutlinedIcon />
        </button>
      </div>
      {stories.map((story) => (
        <div className="story" key={story.id}>
          <img src={story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  );
};
export default Stories;
