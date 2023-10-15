import "./Tweet.css";

import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { VscVerifiedFilled } from "react-icons/vsc";
import { Link } from "react-router-dom";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import RepeatIcon from "@mui/icons-material/Repeat";

import { useTweets } from "../../../Context/TweetContext";
import { useUser } from "../../../Context/UserContext";
import { ITweetProps } from "../../../Types/type";
import { isBlocked } from "../../../Utils/commonFunction";
import {
  fetchCommentsByParentId,
  fetchUsersWhoLikedTweet,
  likeTweetById,
  unlikeTweetById,
} from "../../../Utils/TweetFunction";
import CommentForm from "../../CommentForm/CommentForm";
import DropdownTweet from "../DropdownTweet/DropdownTweet";

const Tweet: React.FC<ITweetProps> = (props) => {
  const { tweet } = props;
  const { user: currentUser } = useUser();
  const { tweets } = useTweets();
  const [showCommentForm, setShowCommentForm] = useState(false);
  // Hàm hỗ trợ để định dạng thời gian đăng bài post
  const formatTimestamp = (timestamp: string) => {
    const date = moment(new Date(timestamp)); // Tạo đối tượng moment từ timestamp
    const now = moment(); // Đối tượng moment hiện tại
    if (now.diff(date, "days") < 1) {
      // Nếu chưa đủ 1 ngày
      return date.fromNow(); // Hiển thị dưới dạng "x phút trước", "vài giây trước",...
    } else {
      return date.format("DD/MM/YYYY"); // Hiển thị dưới dạng "ngày/tháng"
    }
  };
  //CHECK BLOKC USER
  const [isCheckBlockUser, setIsCheckBlockUser] = useState<boolean>(true);
  const checkIsBlockUser = async (blockedUserId: string) => {
    const response = await isBlocked(blockedUserId);
    setIsCheckBlockUser(response);
  };
  useEffect(() => {
    checkIsBlockUser(tweet.author._id.toString());
  }, [tweet]);

  // Step 1: Check if currentUser liked the tweet

  const [like, setLike] = useState(false);

  // Step 2: useState for likes count
  const [likesCount, setLikesCount] = useState<number>(
    tweet.likes?.length || 0
  );

  //HIỂN THỊ SỐ COMMENTS CHO TỪNG TWEET
  const [commentCount, setCommentCount] = useState<number>(0);

  useEffect(() => {
    const loading = async () => {
      const userLikes = await fetchUsersWhoLikedTweet(tweet?._id);
      setLikesCount(userLikes.length);
      const countsComment = await fetchCommentsByParentId(tweet?._id).then(
        (comments) => comments.length
      );
      setCommentCount(countsComment);
      const isLikedByCurrentUser = tweet.likes?.some(
        (like) => like === currentUser?._id
      );
      setLike(isLikedByCurrentUser);
    };
    loading();
  }, [tweets]);

  const handleLike = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    tweetId: string
  ) => {
    e.stopPropagation();
    setLike(true);
    setLikesCount((prevCount) => prevCount + 1);
    await likeTweetById(tweetId);
  };

  const handleUnLike = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    tweetId: string
  ) => {
    e.stopPropagation();
    setLike(false);
    setLikesCount((prevCount) => prevCount - 1);
    await unlikeTweetById(tweetId);
  };

  //OPEN COMMENT FORM
  const handleOpenCommentForm = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setShowCommentForm(!showCommentForm);
  };
  const handleCloseCommentForm = () => {
    setShowCommentForm(false);
  };
  if (isCheckBlockUser) return "";
  return (
    <div
      className="tweet nav-link"
      onClick={() => (window.location.href = `/post-detail/${tweet._id}`)}
    >
      <div className="tweet-header">
        <div className="tweet-info nav-link flex align-items-center">
          <Link
            to={`/profile/${tweet?.author?._id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={tweet?.author?.avatar} alt="Avatar" className="avatar" />
          </Link>
          <Link
            to={`/profile/${tweet?.author?._id}`}
            className="m-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="fullname">
              {tweet?.author?.fullname}
              {tweet?.author?.verify > 0 && (
                <VscVerifiedFilled className="text-blue-500 inline" />
              )}
            </span>

            <span className="username my-0 block text-sm font-bold text-gray-400">
              @{tweet?.author?.username}
            </span>
            <span className="timestamp">
              {formatTimestamp(tweet?.createdAt)}
            </span>
          </Link>
        </div>
        <DropdownTweet
          tweetAuthorId={tweet?.author?._id}
          tweetId={tweet?._id}
        />
      </div>
      <div className="tweet-content">{tweet?.content}</div>

      <div className="imgs-tweets">
        {tweet?.medias?.length
          ? tweet?.medias?.map((media, index) => (
              <img className="tweet-image rounded-xl" src={media} key={index} />
            ))
          : ""}
      </div>
      <div className="tweet-footer">
        <span className="likes font-bold">
          {likesCount}
          {!like && (
            <FavoriteBorderIcon
              className="icon-tweet text-red-500"
              onClick={(e) => handleLike(e, tweet?._id)}
            />
          )}
          {like && (
            <FavoriteOutlinedIcon
              className="text-red-500"
              onClick={(e) => handleUnLike(e, tweet?._id)}
            />
          )}
        </span>
        <span className="retweets font-bold">
          0 <RepeatIcon className="icon-tweet text-blue-500" />
        </span>
        <span
          className="comment font-bold"
          onClick={(e) => {
            handleOpenCommentForm(e);
          }}
        >
          {commentCount}
          <FaRegComment className="icon-tweet text-blue-500 inline text-lg ml-1" />
        </span>
      </div>
      {showCommentForm && (
        <CommentForm onBlur={handleCloseCommentForm} tweet={tweet} />
      )}
    </div>
  );
};

export default Tweet;
