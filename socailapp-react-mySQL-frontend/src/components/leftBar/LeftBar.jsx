import "./leftBar.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const LeftBar = ({ show }) => {
  const { currentUser, DEFAULT_PROFILE_PICTURE } = useContext(AuthContext);

  return (
    <div className={`leftBar ${show ? "" : "collapsed"}`}>
      <div className="container">
        <div className="menu">
          <div className="user">
            <img
              src={
                currentUser.profilePicture
                  ? `/uploads/${currentUser.profilePicture}`
                  : DEFAULT_PROFILE_PICTURE
              }
              alt=""
            />
            <span>{currentUser.name}</span>
          </div>
          <div className="item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/8131/8131340.png"
              alt=""
            />
            <span>Friends</span>
          </div>
          <div className="item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/166/166258.png"
              alt=""
            />
            <span>Groups</span>
          </div>
          <div className="item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9198/9198446.png"
              alt=""
            />
            <span>Marketplace</span>
          </div>
          <div className="item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4237/4237920.png"
              alt=""
            />
            <span>Watch</span>
          </div>
          <div className="item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3321/3321396.png"
              alt=""
            />
            <span>Memories</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span className="title">Shortcuts</span>
          <div className="item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/685/685836.png"
              alt=""
            />
            <span>Messages</span>
          </div>
          <div className="item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/975/975392.png"
              alt=""
            />
            <span>Events</span>
          </div>
          <div className="item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3516/3516069.png"
              alt=""
            />
            <span>Gaming</span>
          </div>
          <div className="item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1375/1375106.png"
              alt=""
            />
            <span>Gallery</span>
          </div>
          <div className="item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4503/4503949.png"
              alt=""
            />
            <span>Videos</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeftBar;
