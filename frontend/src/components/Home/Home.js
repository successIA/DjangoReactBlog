import React, { useEffect, useState } from "react";
import axios from "axios";
import { PostContent } from "../Post";
import "./index.scss";
import posts from "../../data/post";
import { POST_LIST_URL } from "../../constants";

const Home = () => {
  const [postData, setPostData] = useState({});

  useEffect(() => {
    console.log(POST_LIST_URL);
    axios
      .get(POST_LIST_URL)
      .then(res => {
        console.log(res.data);
        setPostData(res.data);
      })
      .catch(error => console.log("Something went wrong:", error));
  }, []);

  const posts = postData.results ? postData.results : [];

  return (
    <div className="page">
      <div className="container">
        {posts.map(post => (
          <div key={post.id} className="container__row">
            <PostContent linkTitle post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
