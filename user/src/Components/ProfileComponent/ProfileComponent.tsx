import "./ProfileComponent.css";

import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { useTweets } from "../../Context/TweetContext";
import { fetchTweetsByUserId } from "../../Utils/TweetFunction";
import Tweet from "../Common/Tweet/Tweet";
import Followers from "./Follower/Followers";
import Following from "./Following/Following";
import ProfileInfo from "./ProfileInfo/ProfileInfo";

const ProfileComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Tweets");
  const { tweets, setTweets, resetTweets } = useTweets();
  const { id } = useParams();
  const location = useLocation();
  //Xủ lý Tab đang active
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        if (id) {
          resetTweets();
          const data = await fetchTweetsByUserId(id);
          setTweets(data);
        }
      } catch (error) {
        console.error("Failed to fetch tweets:", error);
      }
    };
    fetchTweet();
  }, [id, setTweets]);
  useEffect(() => {
    if (location.pathname === `/profile/${id}`) {
      const fetchTweet = async () => {
        try {
          if (id) {
            resetTweets();
            const data = await fetchTweetsByUserId(id);
            setTweets(data);
          }
        } catch (error) {
          console.error("Failed to fetch tweets:", error);
        }
      };
      fetchTweet();
    }
  }, [id]);

  return (
    <div className="profile-content border border-gray">
      <ProfileInfo />
      <div className="profile-menu">
        <div
          className={`menu-item ${activeTab === "Tweets" ? "active" : ""}`}
          onClick={() => handleTabClick("Tweets")}
        >
          Tweets
        </div>
        <div
          className={`menu-item ${activeTab === "Follwers" ? "active" : ""}`}
          onClick={() => handleTabClick("Follwers")}
        >
          Follwers
        </div>
        <div
          className={`menu-item ${activeTab === "Following" ? "active" : ""}`}
          onClick={() => handleTabClick("Following")}
        >
          Following
        </div>
      </div>

      {/* HIỂN THỊ THEO TAB KHI ACTIVE */}
      {activeTab === "Tweets" ? (
        tweets.length > 0 ? (
          tweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
        ) : (
          <h5 className="no-tweets-message font-bold text-red-500 text-lg">
            No any Tweets
          </h5>
        )
      ) : activeTab === "Follwers" ? (
        <Followers />
      ) : (
        <Following />
      )}
    </div>
  );
};

export default ProfileComponent;
