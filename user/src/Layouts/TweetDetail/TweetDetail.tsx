import React from "react";

import LeftBar from "../../Components/Common/LeftBar/LeftBar";
import RightBar from "../../Components/Common/RightBar/RightBar";
import TweetDetailComponent from "../../Components/TweetDetailComponent/TweetDetailComponent";

const TweetDetail: React.FC = () => {
  return (
    <div className="tweet-detail container flex justify-between align-items-center">
      <LeftBar />
      <TweetDetailComponent />
      <RightBar />
    </div>
  );
};

export default TweetDetail;
