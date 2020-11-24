import React from "react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import Moment from "react-moment";
import dot from "../../assets/dot.svg";

export const PostContent = props => {
  const { post, linkTitle } = props;

  const titleWithLink = (
    <div className="post-content__title">
      <Link to={`/${post.slug}`}>{post.title}</Link>
    </div>
  );

  return (
    <div className="post-content">
      {linkTitle ? (
        titleWithLink
      ) : (
        <div className="post-content__title">{post.title}</div>
      )}

      <div className="post-content__time-list">
        <span className="post-content__time-list-item">
          <Moment format="MMMM D, YYYY" fromNow>
            {post.created}
          </Moment>
        </span>
        <span className="post-content__time-list-item">
          <ReactSVG src={dot} className="svg--circle" />
        </span>
        <span className="post-content__time-list-item">{post.read_time}</span>
      </div>
      <p className="post-content__body">{post.body}</p>
    </div>
  );
};
