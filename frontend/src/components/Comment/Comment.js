import React, { useState } from "react";

import { PostHeader } from "../Post";

import "./index.scss";
import favorite from "../../assets/favorite.svg";
import edit from "../../assets/edit.svg";
import remove from "../../assets/remove.svg";
import useWindowSize from "../../hooks/useWindowSize";
import { ReactSVG } from "react-svg";
import { BASE_COMMENT_TOGGLE_LIKE_URL } from "../../constants";
import { useEffect } from "react";
import { useRef } from "react";

const EDIT_COMMENT = "EDIT_COMMENT";
const DELETE_COMMENT = "DELETE_COMMENT";

const dropdownData = [
  {
    key: EDIT_COMMENT,
    icon: edit,
    text: "Edit Comment"
  },
  { key: DELETE_COMMENT, icon: remove, text: "Delete Comment" }
];

const Comment = ({
  post,
  comment,
  dropdownStateList,
  setDropdownStateList,
  onLikeComment,
  newId,
  onNewlyAdded
}) => {
  const [showMoreActionButton, setShowMoreActionButton] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const commentRef = useRef(null);
  const [width] = useWindowSize();
  const isSmallScreen = width < 768;

  const handleMoreButtonClick = (/*commentId*/) => {
    setShowDropdown(!showDropdown);
  };

  const handleDropdownVisibility = () => {
    setShowDropdown(false);
  };

  const handleDropdownRowClick = (key /*, commentId*/) => {
    console.log("Comment:", key);
    setShowDropdown(false);
  };

  useEffect(() => {
    if (comment.id === newId && commentRef.current) {
      console.log("DIM:", commentRef.current.getBoundingClientRect());
      onNewlyAdded(commentRef.current.getBoundingClientRect().top);
    }
  });

  return (
    <>
      {/* {showDropdown ? (
        <Dropdown
          data={dropdownData}
          onHideDropDown={handleDropdownVisibility}
          onDropdownRowClick={handleDropdownRowClick}
        />
      ) : null} */}

      <div
        className="comment"
        onMouseOver={() => setShowMoreActionButton(true)}
        onMouseLeave={() => setShowMoreActionButton(false)}
        ref={commentRef}
      >
        {/* <a href={`#${comment.id}`}></a> */}
        <PostHeader
          post={comment}
          showTimestamp={true}
          onMoreButtonClick={handleMoreButtonClick}
          showDropdown={showDropdown}
          showMoreActionButton={isSmallScreen ? true : showMoreActionButton}
          onHideDropDown={handleDropdownVisibility}
          onDropdownRowClick={handleDropdownRowClick}
          dropdownData={dropdownData}
        />
        <p className="comment__text">{comment.body}</p>

        <div className="comment__footer">
          <div className="comment__footer-item">
            <div
              className={
                comment.is_liked
                  ? "comment__favorite-icon comment__favorite-icon--liked"
                  : "comment__favorite-icon"
              }
            >
              <ReactSVG src={favorite} onClick={() => onLikeComment(comment)} />
            </div>
          </div>
          <div className="comment__footer-item">
            <span className="comment__favorite-count">
              {comment.likes ? comment.likes : ""}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Comment;
