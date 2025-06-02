import "./rightBar.scss";

const RightBar = () => {
  return (
    <div className="rightbar">
      <div className="container">
        <div className="item">
          <span>Suggestions</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://cdn-icons-png.flaticon.com/512/219/219987.png"
                alt=""
              />
              <span>Sasha Brown</span>
            </div>
            <div className="buttons">
              <button>Follow</button>
              <button>Unfollow</button>
            </div>
          </div>
        </div>
        <div className="item">
          <span>Latest Activity</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://cdn-icons-png.flaticon.com/512/219/219987.png"
                alt=""
              />
              <p>
                <span>Sasha Brown</span> changed their profile picture
              </p>
            </div>
            <span>1 hour ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://cdn-icons-png.flaticon.com/512/219/219987.png"
                alt=""
              />
              <p>
                <span>Sasha Brown</span> changed their profile picture
              </p>
            </div>
            <span>1 hour ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://cdn-icons-png.flaticon.com/512/219/219987.png"
                alt=""
              />
              <p>
                <span>Sasha Brown</span> changed their profile picture
              </p>
            </div>
            <span>1 hour ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://cdn-icons-png.flaticon.com/512/219/219987.png"
                alt=""
              />
              <p>
                <span>Sasha Brown</span> changed their profile picture
              </p>
            </div>
            <span>1 hour ago</span>
          </div>
        </div>
        <div className="item">
          <span>Online Friends</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://cdn-icons-png.flaticon.com/512/219/219987.png"
                alt=""
              />
              <div className="online"></div>
              <span>Sasha Brown</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RightBar;
