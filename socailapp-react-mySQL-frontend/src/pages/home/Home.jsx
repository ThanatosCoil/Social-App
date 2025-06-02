import "./home.scss";
import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import { memo, useState } from "react";

const Home = memo(() => {
  const [showAll, setShowAll] = useState(false);
  return (
    <div className="home">
      <Stories />
      <Share />
      <div className="posts-toggle">
        <button
          className={showAll ? "" : "active"}
          onClick={() => setShowAll(false)}
        >
          Feed
        </button>
        <button
          className={showAll ? "active" : ""}
          onClick={() => setShowAll(true)}
        >
          All Posts
        </button>
      </div>
      <Posts all={showAll} />
    </div>
  );
});

export default Home;
