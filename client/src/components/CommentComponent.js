import React, { useState } from "react";
import { format } from "date-fns";
import WriteCommentComponent from "./WriteCommentComponent";
import RepliesSection from "./RepliesSection";

export default function CommentComponent({ comment }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isRepliesVisible, setIsRepliesVisible] = useState(false);

  const clickOnReply = (event) => {
    setIsFormVisible((current) => !current);
  };

  const clickOnShowReplies = (event) => {
    setIsRepliesVisible((current) => !current);
  };

  return (
    <div className="container" id={comment.id}>
      <div className="comment__container opened">
        <div className="comment__card">
          <h3 className="comment__title">
            {comment.username} - {comment.email}{" "}
            {format(new Date(comment.createdAt), "yyyy-MM-dd hh:mm:ss")}
          </h3>
          <div>
            <div className="comment-content">
              {comment.fileUrl ? (
                <div className="comment-image">
                  <img
                    src={process.env.REACT_APP_API_STATIC_URL + comment.fileUrl}
                    alt={"Image for comment with id " + comment.id}
                  ></img>
                </div>
              ) : null}

              {
                <div
                  className="comment-text"
                  dangerouslySetInnerHTML={{ __html: comment.text }}
                />
              }
            </div>
          </div>
          <div className="comment__card-footer">
            <div className="reply" onClick={clickOnReply}>
              Reply
            </div>
            <div className="show-replies" onClick={clickOnShowReplies}>
              Show replies {comment.repliesCount}
            </div>
          </div>
        </div>
        {isFormVisible ? (
          <WriteCommentComponent commentId={comment.id} />
        ) : null}
        {isRepliesVisible ? <RepliesSection commentId={comment.id} /> : null}
      </div>
    </div>
  );
}
