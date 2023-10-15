import "./HomeComponent.css";

import React, { useEffect } from "react";

import { useTweets } from "../../Context/TweetContext";
import { getRelevantTweets } from "../../Utils/commonFunction";
import Tweet from "../Common/Tweet/Tweet";
import HomeHeader from "../HomeHeader/HomeHeader";

const HomeComponent = () => {
  const { tweets, setTweets } = useTweets();

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const data = await getRelevantTweets();
        setTweets(data);
      } catch (error) {
        console.error("Failed to fetch tweets:", error);
      }
    };
    fetchTweet();
  }, [setTweets]);

  const handleNewTweetPosted = async () => {
    try {
      const data = await getRelevantTweets();
      setTweets(data);
    } catch (error) {
      console.error("Failed to fetch tweets after posting new one:", error);
    }
  };

  return (
    <div className="home-component border border-gray">
      <HomeHeader onNewTweet={handleNewTweetPosted} />
      {tweets.map((tweet) => (
        <Tweet key={tweet._id} tweet={tweet} />
      ))}
    </div>
  );
};

export default HomeComponent;
