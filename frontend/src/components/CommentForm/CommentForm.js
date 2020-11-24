import React, { useState } from "react";

import "./index.scss";

const CommentForm = ({ onHideCommentForm, onCommentSubmit, isLoading }) => {
  const [body, setBody] = useState("");

  const handleFormSubmit = e => {
    e.preventDefault();
    console.log("Submitting:", body);
    // return;
    onCommentSubmit({ body });
  };

  return (
    <form className="comment-form" onSubmit={handleFormSubmit}>
      <div className="comment-form__item">
        <div className=" comment-form__text">
          You are commenting as
          <a href="#" className="comment-form__author">
            mario
          </a>
        </div>
      </div>
      <div className="comment-form__item">
        <textarea
          id=""
          className=" comment-form__textarea"
          cols="30"
          rows="5"
          placeholder="What are your thoughts?"
          value={body}
          onChange={e => setBody(e.target.value)}
        ></textarea>
      </div>
      <div className="comment-form__item">
        <div className="comment-form__btn-row">
          <button
            type="submit"
            className="comment-form__btn btn btn--primary"
            disabled={body.trim().length === 0 ? true : false}
          >
            Submit {isLoading ? <span className="loader"></span> : null}
          </button>
          <button
            className="comment-form__btn btn btn--default"
            onClick={() => onHideCommentForm()}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
