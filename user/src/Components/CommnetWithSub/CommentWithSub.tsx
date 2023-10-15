// Tạo một component mới có tên CommentWithSub.tsx (hoặc tên tương tự)

import React, { useEffect, useState } from "react";

import { useTweets } from "../../Context/TweetContext";
import { ITweetLocal } from "../../Types/type";
import { fetchCommentsByParentId } from "../../Utils/TweetFunction";
import Tweet from "../Common/Tweet/Tweet";

type CommentWithSubProps = {
  comment: ITweetLocal;
};

const CommentWithSub: React.FC<CommentWithSubProps> = ({ comment }) => {
  const [subComments, setSubComments] = useState<ITweetLocal[]>([]);
  const { tweets } = useTweets();

  useEffect(() => {
    const loadSubComments = async () => {
      const fetchedSubComments = await fetchCommentsByParentId(comment._id);
      setSubComments(fetchedSubComments);
    };
    loadSubComments();
  }, [comment._id, tweets]);
  return (
    <>
      <Tweet tweet={comment} />
      <div className="sub-comments ms-10">
        {subComments.map((subComment) => (
          <CommentWithSub comment={subComment} key={subComment._id} />
        ))}
      </div>
    </>
  );
};

export default CommentWithSub;
