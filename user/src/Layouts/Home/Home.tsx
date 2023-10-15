import React from "react";

import LeftBar from "../../Components/Common/LeftBar/LeftBar";
import RightBar from "../../Components/Common/RightBar/RightBar";
import HomeComponent from "../../Components/HomeComponent/HomeComponent";

const Home = () => {
  return (
    <div className="home container flex justify-between align-items-center">
      <LeftBar />
      <HomeComponent />
      <RightBar />
    </div>
  );
};

export default Home;
