import React from "react";
import "./Trending.css";

const Trending: React.FC = () => {
  return (
    <div className="trending-container">
      <div className="trending-header">
        <h2 className="font-bold text-xl">Trending for you</h2>
      </div>
      <div className="trending-list">
        <div className="trend-item">
          <p className="trend-topic">#Bitcoin</p>
          <p className="trend-tweets">123k Tweets</p>
        </div>
        <div className="trend-item">
          <p className="trend-topic">#USDC</p>
          <p className="trend-tweets">123k Tweets</p>
        </div>
        <div className="trend-item">
          <p className="trend-topic">#PiNetwork</p>
          <p className="trend-tweets">100k Tweets</p>
        </div>
        <div className="trend-item">
          <p className="trend-topic">#Crypto</p>
          <p className="trend-tweets">100k Tweets</p>
        </div>
        <div className="trend-item">
          <p className="trend-topic">#USDC</p>
          <p className="trend-tweets">123k Tweets</p>
        </div>
        <div className="trend-item">
          <p className="trend-topic">#PiNetwork</p>
          <p className="trend-tweets">100k Tweets</p>
        </div>
      </div>
    </div>
  );
};

export default Trending;
