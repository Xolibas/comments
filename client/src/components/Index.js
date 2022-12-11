import React, { useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { Context } from "../index";
import { getAll } from "../services/commentService";
import Pages from "./Pages";
import CommentSection from "./CommentSection";
import WriteCommentComponent from "./WriteCommentComponent";
import { observer } from "mobx-react-lite";

const Index = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { comment } = useContext(Context);

  useEffect(() => {
    getAll(
      searchParams.get("sortBy"),
      searchParams.get("orderBy"),
      comment.page,
      comment.limit
    ).then((data) => {
      comment.setComments(data.rows);
      comment.setTotalCount(data.count);
    });
  }, [searchParams, comment.page, comment.limit, comment.totalCount]);

  return (
    <div>
      <div className="wrapper__sort-buttons">
        <select
          defaultValue={searchParams.get("sortBy")}
          onChange={(e) => {
            setSearchParams({
              sortBy: e.target.value,
              orderBy: searchParams.get("orderBy") == null ? 0 : searchParams.get("orderBy"),
            });
          }}
        >
          <option value="0">Created At</option>
          <option value="1">Username</option>
          <option value="2">Email</option>
        </select>
        <select
          defaultValue={searchParams.get("orderBy")}
          onChange={(e) => {
            setSearchParams({
              sortBy: searchParams.get("sortBy") == null ? 0 : searchParams.get("sortBy") ,
              orderBy: e.target.value,
            });
          }}
        >
          <option value="0">ASC</option>
          <option value="1">DESC</option>
        </select>
      </div>
      <CommentSection />
      <Pages />
      <WriteCommentComponent commentId={null} />
    </div>
  );
});

export default Index;
