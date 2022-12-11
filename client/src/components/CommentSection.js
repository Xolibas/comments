import React, { useContext } from "react";
import { Context } from "../index";
import CommentComponent from "./CommentComponent";
import {observer} from "mobx-react-lite";

const CommentSection = observer(() => {
  const { comment } = useContext(Context);

  return (
    <div>
      {comment.comments.map(comment => (
        <CommentComponent key={comment.id} comment={comment} />
      ))}
    </div>
  );
})

export default CommentSection;
