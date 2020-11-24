import React from "react";

import avatar from "../../assets/avatar.png";
import edit from "../../assets/edit.svg";

import "./index.scss";

export const Userprofile = () => {
  return (
    <div className="page">
      <div className="container">
        <div className="userprofile-info">
          <div className="userprofile-info__media">
            <img
              src={avatar}
              alt=""
              className="avatar avatar--large bordered-circle"
            />

            <button className="userprofile-info__edit-avatar-btn bordered-circle">
              <img src={edit} alt="" />
            </button>
          </div>

          <div className="userprofile-info__username">John Doe</div>
        </div>
      </div>

      <div className="container">
        <div className="userprofile-stat">
          <div className="userprofile-stat__item">
            <div className="userprofile-stat__item-inner">
              <div className="userprofile-stat__title">200</div>
              <div className="userprofile-stat__subtitle">comments</div>
            </div>
          </div>
          <div className="userprofile-stat__item">
            <div className="userprofile-stat__item-inner">
              <div className="userprofile-stat__title">100</div>
              <div className="userprofile-stat__subtitle">likes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="userprofile-post-info">
        <div className="userprofile-post-info__tab-row">
          <a
            href="#"
            className="userprofile-post-info__tab-item userprofile-post-info__tab-item--active"
          >
            <div className="userprofile-post-info__tab-text userprofile-post-info__tab-text--active">
              Comments
            </div>
          </a>
          <a href="#" className="userprofile-post-info__tab-item">
            <div className="userprofile-post-info__tab-text">Liked</div>
          </a>
          <a href="#" className="userprofile-post-info__tab-item">
            <div className="userprofile-post-info__tab-text">Saved</div>
          </a>
        </div>
      </div>
    </div>
  );
};
