import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

import "./index.scss";
import posts from "../../data/post";
import comments from "../../data/comment";

import arrow_left from "../../assets/arrow_left.svg";
import arrow_right from "../../assets/arrow_right.svg";

import expand_more from "../../assets/expand_more.svg";
import Dropdown, { DropdownWrapper } from "../Dropdown";
import Comment from "../Comment";
import { PostContent } from "./PostContent";

import CommentForm from "../CommentForm";
import { useRef } from "react";
import {
  BASE_POST_DETAIL_URL,
  BASE_COMMENT_TOGGLE_LIKE_URL
} from "../../constants";
import { getTokenConfig, AuthContext } from "../../app/App";
import { useContext } from "react";

const RELEVANT = "RELEVANT";
const NEWEST = "NEWEST";

const commentSortDropdownData = [
  {
    key: RELEVANT,
    text: "Relevant"
  },
  { key: NEWEST, text: "Newest" }
];

const Post = props => {
  const [showCommentSortDropdown, setShowCommentSortDropdown] = useState(false);

  const defaultCommentSortText = commentSortDropdownData[0].text;
  const [commentSortText, setCommentSortText] = useState(
    defaultCommentSortText
  );

  const [showCommentForm, setShowCommentForm] = useState(false);

  const [
    commentMoreDropdownStateList,
    setCommentMoreDropdownStateList
  ] = useState([]);

  const commentSortButtonRef = useRef(null);

  const [post, setPost] = useState(undefined);

  const [commentData, setCommentData] = useState(undefined);

  const [commentIsSubmitLoading, setCommentIsSubmitLoading] = useState(false);

  const [newlyAddedCommentId, setNewlyAddedCommentId] = useState(null);

  const authContext = useContext(AuthContext);

  const history = useHistory();

  const POST_DETAIL_URL = `${BASE_POST_DETAIL_URL}${props.match.params.slug}`;

  useEffect(() => {
    console.log(BASE_POST_DETAIL_URL);
    console.log("cfg:", getTokenConfig());
    axios
      .get(POST_DETAIL_URL, getTokenConfig())
      .then(res => {
        console.log(res.data);
        setPost(res.data);
      })
      .then(() => {
        axios
          .get(`${POST_DETAIL_URL}/comments/`, getTokenConfig())
          .then(res => {
            console.log("comments:", res.data);
            setCommentData(res.data);
          });
      })
      .catch(error => console.log("Something went wrong:", error));
  }, []);

  const handleShowCommentSortDropdown = () => {
    setShowCommentSortDropdown(false);
  };

  const handleCommentSortDropdownRowClick = key => {
    console.log("CommentSort:", key);
    setShowCommentSortDropdown(false);
    const selectedText = commentSortDropdownData.find(data => data.key === key)
      .text;
    setCommentSortText(selectedText);

    const querystring = key == NEWEST ? "?newest=1" : "";

    axios
      .get(`${POST_DETAIL_URL}/comments/${querystring}`, getTokenConfig())
      .then(res => {
        console.log(`${key} comments:`, res.data);
        setCommentData(res.data);
      })
      .catch(error => console.log("Something went wrong:", error));
  };

  const handleCommentLike = comment => {
    if (!authContext.currentUser) {
      history.push("/login");
    }

    const url = `${BASE_COMMENT_TOGGLE_LIKE_URL}/${comment.id}/toggle-like/`;
    axios
      .post(url, { like: !comment.is_liked }, getTokenConfig())
      .then(res => {
        const newResults = commentData.results.map(comment => {
          if (comment.id === res.data.comment) {
            const newComment = {
              ...comment,
              likes: res.data.likes,
              is_liked: res.data.is_liked
            };
            return newComment;
          }
          return comment;
        });

        setCommentData({ ...commentData, results: newResults });
      })
      .catch(error => {
        if (error.response) {
          console.log("Something went wrong:", error.response.data);
        } else {
          console.log(error);
        }
      });
  };

  const handleCommentSubmit = comment => {
    if (!authContext.currentUser) {
      history.push("/login");
    }

    setCommentIsSubmitLoading(true);

    const url = `${POST_DETAIL_URL}/comments/`;
    axios
      .post(url, comment, getTokenConfig())
      .then(res => {
        const newResults = [...commentData.results];
        newResults.unshift(res.data);
        setCommentData({ ...commentData, results: newResults });
        setNewlyAddedCommentId(res.data.id);
        setCommentIsSubmitLoading(false);
      })
      .catch(error => {
        setCommentIsSubmitLoading(false);
        if (error.response) {
          console.log("Something went wrong:", error.response.data);
        } else {
          console.log(error);
        }
      });
  };

  if (!post) return <div>Loading</div>;

  // comments =

  return (
    <div className="page page--bg-gray page--bg-white-md">
      {showCommentForm && (
        <CommentForm
          onHideCommentForm={() => setShowCommentForm(false)}
          onCommentSubmit={handleCommentSubmit}
          isLoading={commentIsSubmitLoading}
        />
      )}

      <div className="container">
        <div className="container__row">
          {/* <PostHeader post={post} showTimestamp={false} /> */}
          <PostContent post={post} />
        </div>
      </div>

      <div className="commentlist-action-wrapper">
        <div className="commentlist-action-bar">
          <DropdownWrapper>
            <button
              ref={commentSortButtonRef}
              onClick={() => setShowCommentSortDropdown(true)}
              className="commentlist-action-bar__sort-btn btn--flat"
            >
              {commentSortText}
              <img
                src={expand_more}
                alt=""
                className="commentlist-action-bar__sort-btn-icon"
              />
            </button>
            {showCommentSortDropdown && (
              <Dropdown
                toggleElement={commentSortButtonRef}
                data={commentSortDropdownData}
                onHideDropDown={handleShowCommentSortDropdown}
                onDropdownRowClick={handleCommentSortDropdownRowClick}
                leftAligned={true}
              />
            )}
          </DropdownWrapper>
          <button
            className="commentlist-action-bar__comment-btn btn btn--small btn--primary"
            onClick={() => setShowCommentForm(true)}
          >
            Comment
          </button>
        </div>
      </div>

      {commentData ? (
        commentData.results.length > 0 ? (
          commentData.results.map(comment => (
            <div
              key={comment.id}
              className="container container__y-border-margin-1"
            >
              <Comment
                post={post}
                comment={comment}
                dropdownStateList={commentMoreDropdownStateList}
                setDropdownState={setCommentMoreDropdownStateList}
                onLikeComment={handleCommentLike}
                newId={newlyAddedCommentId}
                onNewlyAdded={scrollTo => {
                  window.scrollTo(scrollTo);
                  setNewlyAddedCommentId(null);
                }}
              />
            </div>
          ))
        ) : (
          <div>No comments</div>
        )
      ) : (
        <div className="container container__y-border-margin-1">
          <div>loading comments...</div>
        </div>
      )}

      {/* {comments.map(comment => (
        <div
          key={comment.id}
          className="container container__y-border-margin-1"
        >
          <Comment
            post={post}
            comment={comment}
            dropdownStateList={commentMoreDropdownStateList}
            setDropdownState={setCommentMoreDropdownStateList}
          />
        </div>
      ))} */}

      <div className="related-post-wrapper container__y-border-margin-2">
        <div className="related-post">
          <div className="related-post__header">
            <div className="related-post__title">Related Posts</div>
          </div>

          <ul className="related-post__list">
            {posts.map(post => (
              <li key={post.id} className="related-post__list-item">
                <div className="related-post__list-item-text">
                  <Link
                    to={`/${post.slug}`}
                    className="related-post__list-item-link"
                  >
                    {post.title}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container container__y-border-margin-2">
        <div className="container__row">
          <div className="post-nav post-nav--left">
            <Link to={`/${post.slug}`} className="post-nav__item ">
              <div className="post-nav__text">{post.title}</div>
              <div className="post-nav__icon-left">
                <img src={arrow_left} alt="" />
              </div>
            </Link>
          </div>
          <div className="post-nav post-nav--right">
            <Link to={`/${post.slug}`} className="post-nav__item ">
              <div className="post-nav__text">{post.title}</div>
              <div className="post-nav__icon-right">
                <img src={arrow_right} alt="" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
