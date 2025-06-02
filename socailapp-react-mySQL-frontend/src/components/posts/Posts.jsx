import { useQuery } from "@tanstack/react-query";
import Post from "../post/Post";
import "./posts.scss";
import api from "../../../axios";

const Posts = ({ userId, all }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", all ? "all" : userId],
    queryFn: () =>
      all
        ? api.get("/posts/all").then((res) => res.data)
        : api
            .get("/posts" + (userId ? `?userId=${userId}` : ""))
            .then((res) => res.data),
    staleTime: 10000,
    cacheTime: 300000,
  });

  return (
    <div className="posts">
      {error
        ? "Something went wrong..."
        : isLoading
        ? "Loading..."
        : data.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
