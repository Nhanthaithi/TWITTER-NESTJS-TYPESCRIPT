import React from "react";
import TopLeftBar from "./TopLeftBar";
import BottomLeftBar from "./BottomLeftBar";
import "./LeftBar.css";

const LeftBar = () => {
  return (
    <div className="left-bar flex flex-col p-4 lg-up:sticky lg-up:top-0 fixed bottom-0">
      <TopLeftBar />
      <BottomLeftBar />
    </div>
  );
};

export default LeftBar;
