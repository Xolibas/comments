import React, { useEffect, useState } from "react";
import { getReplies } from "../services/commentService";
import CommentComponent from "./CommentComponent";

export default function RepliesSection(id) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getReplies(id.commentId).then((data) => {
      setComments(data.data);
    });
  }, [id]);

  return (
    <div>
      {comments.map(comment => (
        <CommentComponent
          key={comment.id}
          comment={comment}
        />
      ))}
    </div>
  );
}
