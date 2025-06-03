import {
  EmailOutlined,
  FacebookTwoTone,
  Instagram,
  LanguageOutlined,
  LinkedCamera,
  MoreHorizOutlined,
  Place,
  WhatsApp,
  X,
  CameraAlt,
} from "@mui/icons-material";
import "./profile.scss";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../axios";
import { useLocation } from "react-router";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import LoadingOverlay from "../../components/loadingOverlay/LoadingOverlay";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Update from "../../components/update/Update";

const Profile = () => {
  const [update, setUpdate] = useState(false);
  const { currentUser, DEFAULT_PROFILE_PICTURE, DEFAULT_COVER_PICTURE } =
    useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      api.get(`/users/find/${userId}`).then((res) => {
        return res.data;
      }),
  });

  const {
    isLoading: isLoadingRelationships,
    error: errorRelationships,
    data: dataRelationships,
  } = useQuery({
    queryKey: ["relationships", userId],
    queryFn: () =>
      api.get(`/relationships?followedUserId=${userId}`).then((res) => {
        return res.data;
      }),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (follow) => {
      if (follow) {
        return api.delete("/relationships?userId=" + userId);
      } else {
        return api.post("/relationships", { userId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationships", userId] });
    },
    onError: (error) => {
      console.error("Error following user:", error);
      toast.error("Failed to follow user. Please try again later.", {});
    },
  });

  const handleFollow = async (e) => {
    e.preventDefault();
    mutation.mutate(dataRelationships.includes(currentUser.id));
  };

  return (
    <div className="profile">
      {isLoading && <LoadingOverlay />}
      {!isLoading && (
        <>
          <div className="images">
            <img
              src={
                data.coverPicture ? data.coverPicture : DEFAULT_COVER_PICTURE
              }
              alt="Cover"
              className="cover"
            />
            <div className="profile-avatar-wrapper">
              <img
                src={
                  data.profilePicture
                    ? data.profilePicture
                    : DEFAULT_PROFILE_PICTURE
                }
                alt="Profile"
                className="profilePic"
              />
            </div>
          </div>
          <div className="profileContainer">
            <div className="profile-main">
              <div className="profile-header">
                {data.name && <span className="profile-name">{data.name}</span>}
                <span className="profile-username">
                  {data.username || "User"}
                </span>
              </div>
              <div className="profile-socials">
                <a href="#">
                  <FacebookTwoTone fontSize="large" />
                </a>
                <a href="#">
                  <Instagram fontSize="large" />
                </a>
                <a href="#">
                  <X fontSize="large" />
                </a>
                <a href="#">
                  <LinkedCamera fontSize="large" />
                </a>
                <a href="#">
                  <WhatsApp fontSize="large" />
                </a>
              </div>
              <div className="profile-action">
                {isLoadingRelationships ? (
                  <LoadingOverlay />
                ) : currentUser.id === userId ? (
                  <button onClick={() => setUpdate(true)}>Edit Profile</button>
                ) : (
                  <button
                    onClick={handleFollow}
                    className={
                      dataRelationships.includes(currentUser.id)
                        ? "unfollow"
                        : "follow"
                    }
                  >
                    {dataRelationships.includes(currentUser.id)
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                )}
              </div>
              <div className="profile-info-row">
                <div className="profile-info-item">
                  <Place />
                  <span>{data.city}</span>
                </div>
                <div className="profile-info-item">
                  <LanguageOutlined />
                  <span>{data.website}</span>
                </div>
                <div className="profile-info-item">
                  <EmailOutlined />
                  <span>{data.email}</span>
                </div>
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {update && <Update setUpdate={setUpdate} user={data} />}
    </div>
  );
};
export default Profile;
