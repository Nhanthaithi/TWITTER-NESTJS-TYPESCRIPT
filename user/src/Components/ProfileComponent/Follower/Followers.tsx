import "./Followers.css";

import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useFollowers } from "../../../Context/FollowersContext";
import { useUser } from "../../../Context/UserContext";
import { IUser } from "../../../Types/type";

const Followers = () => {
  const { user: currentUser } = useUser();
  const { id } = useParams();
  const { followers, setFollowers } = useFollowers();
  const [currentUserFollowings, setCurrentUserFollowings] = useState<IUser[]>(
    []
  );

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/follow/followers/${id}`)
      .then((response) => setFollowers(response.data))
      .catch((error) => console.error("Error fetching followers:", error));
  }, [id]);

  useEffect(() => {
    if (currentUser) {
      axios
        .get(`http://localhost:8000/api/v1/follow/following/${currentUser._id}`)
        .then((response) => {
          setCurrentUserFollowings(response.data);
        });
    }
  }, [currentUser]);

  const isCurrentUserFollowing = (targetUserId: string) => {
    return currentUserFollowings.some(
      (followedUser) => followedUser._id === targetUserId
    );
  };

  return (
    <div className="follower-wrapper">
      {followers.map((follower) => (
        <div className="follower-component" key={follower._id}>
          <Link
            to={`/profile/${follower._id}`}
            className="following-user nav-link"
          >
            <div className="user-img">
              <img src={follower.avatar} alt="avatar" />
            </div>
            <div>
              <h5 className="font-bold text-sm">{follower.fullname}</h5>
              <p className="text-gray-300 m-0">@{follower.username}</p>
            </div>
          </Link>
          <button className="w-28 btn-following">
            {follower?._id === currentUser?._id
              ? "..."
              : isCurrentUserFollowing(follower._id)
              ? "Unfollow"
              : "Follow"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Followers;
