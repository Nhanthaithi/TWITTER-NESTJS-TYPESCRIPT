import "./TweetDetailComponent.css";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useTweets } from "../../Context/TweetContext";
import { ITweetLocal } from "../../Types/type";
import {
  fetchCommentsByParentId,
  fetchTweetById,
} from "../../Utils/TweetFunction";
import CommentWithSub from "../CommnetWithSub/CommentWithSub";
import Tweet from "../Common/Tweet/Tweet";

const TweetDetailComponent: React.FC = () => {
  const { id } = useParams(); //Tweet Id
  const [tweet, setTweet] = useState<ITweetLocal | null>(null);
  const [comments, setComments] = useState<ITweetLocal[]>([]);
  const { tweets } = useTweets();

  useEffect(() => {
    const loadTweet = async () => {
      if (id) {
        const fetchedTweet = await fetchTweetById(id);
        setTweet(fetchedTweet);
      }
    };

    const loadComment = async () => {
      if (id) {
        const data = await fetchCommentsByParentId(id);
        setComments(data);
      }
    };
    loadTweet();
    loadComment();
  }, [id, tweets]);

  return (
    <div className="post-detail-component border border-gray">
      <h4 className="font-bold text-xl ">Tweet</h4>
      <div className="post-detail-header">
        {tweet ? <Tweet tweet={tweet} /> : ""}
      </div>
      <div className="list-comments my-4">
        <h6 className="font-bold text-sm">
          <b>Hidden comment</b>
        </h6>
        <div className="show-list-comment">
          {comments.length > 0 &&
            comments.map((comment) => (
              <CommentWithSub comment={comment} key={comment._id} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default TweetDetailComponent;
