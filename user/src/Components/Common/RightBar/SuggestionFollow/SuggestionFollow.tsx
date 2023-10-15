import "./SuggestionFollow.css";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useFollowers } from "../../../../Context/FollowersContext";
import { useFollowing } from "../../../../Context/FollowingContext";
import { useTweets } from "../../../../Context/TweetContext";
import { useUser } from "../../../../Context/UserContext";
import { IUser } from "../../../../Types/type";
import { getRelevantTweets } from "../../../../Utils/commonFunction";

const SuggestionFollow: React.FC = () => {
  const [suggestions, setSuggestions] = useState<IUser[]>([]);
  const { setFollowings } = useFollowing();
  const { setFollowers } = useFollowers();
  const { user: currentUser } = useUser();
  const { setTweets } = useTweets();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || "";

    // Lấy danh sách gợi ý từ server
    axios
      .get("http://localhost:8000/api/v1/follow/random-follower", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response);
        setSuggestions(response.data);
      });
  }, []);

  const handleFollow = async (userIdToFollow: string) => {
    const token = localStorage.getItem("accessToken") || "";

    await axios
      .post(
        "http://localhost:8000/api/v1/follow/follow-user",
        {
          userIdToFollow,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // Loại bỏ user đã follow khỏi danh sách gợi ý
        setSuggestions((prevSuggestions) =>
          prevSuggestions.filter((user) => user._id !== userIdToFollow)
        );
        if (response.status === 200 && id === currentUser?._id) {
          axios
            .get(
              `http://localhost:8000/api/v1/follow/following/${currentUser?._id}`
            )
            .then((response) => {
              setFollowings(response.data);
            });
        }
        if (response.status === 200 && id !== currentUser?._id) {
          axios
            .get(`http://localhost:8000/api/v1/follow/followers/${id}`)
            .then((response) => {
              setFollowers(response.data);
            });
        }
      });
    // sau khi follow user thành công
    const tweet = await getRelevantTweets();
    setTweets(tweet);
    const event = new CustomEvent("userFollowed", { detail: userIdToFollow });
    window.dispatchEvent(event);
  };

  return (
    <div className="suggest-follow">
      <h2 className="font-bold text-xl">WHO TO FOLLOW</h2>
      {suggestions.map((user: IUser) => (
        <div className="content" key={user._id}>
          <Link to={`/profile/${user._id}`}>
            {" "}
            <div className="info-user flex align-items-center">
              <div className="img-avt">
                <img src={user.avatar} alt="" />
              </div>
              <div className="user-name">
                <b>{user.fullname}</b>
                <p className="text-grey-500 fw-bold m-0">@{user.username}</p>
              </div>
            </div>
          </Link>

          <div className="follow-btn">
            <button
              className="rounded-full"
              onClick={() => handleFollow(user._id)}
            >
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionFollow;
