import React from "react";

import { Link } from "react-router-dom";
import Moment from "react-moment";

import avatar from "../../assets/avatar.png";
import more_horiz from "../../assets/more_horiz.svg";
import Dropdown, { DropdownWrapper } from "../Dropdown";

export const PostHeader = ({
  post,
  showTimestamp,
  onMoreButtonClick,
  showDropdown,
  showMoreActionButton,
  onHideDropDown,
  onDropdownRowClick,
  dropdownData
}) => {
  const moreButtonRef = React.useRef(null);

  return (
    <div className="post-header">
      <div className="post-header__media">
        <img src={avatar} alt="avatar" className="avatar avatar--small" />
        <div>
          <div className="post-header__author">
            <Link to="/u/john-doe">{post.user}</Link>
          </div>
          {showTimestamp ? (
            <div className="post-header__time">
              <Moment format="MMMM D, YYYY">{post.created}</Moment>
            </div>
          ) : null}
        </div>
      </div>

      <DropdownWrapper>
        {(showMoreActionButton || showDropdown) && (
          <img
            ref={moreButtonRef}
            src={more_horiz}
            className="post-header__action"
            onClick={onMoreButtonClick}
          />
        )}
        {showDropdown && (
          <Dropdown
            toggleElement={moreButtonRef}
            wrapperClassName="post-header__dropdown"
            data={dropdownData}
            onHideDropDown={onHideDropDown}
            onDropdownRowClick={onDropdownRowClick}
            // ownerId={co.id}
          />
        )}
      </DropdownWrapper>
    </div>
  );
};
