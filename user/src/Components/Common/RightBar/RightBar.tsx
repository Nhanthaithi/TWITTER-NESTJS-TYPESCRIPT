import React from "react";
import "./RightBar.css";
import SearchBar from "./SearchBar/SearchBar";
import Trending from "./Trending/Trending";
import SuggestionFollow from "./SuggestionFollow/SuggestionFollow";

const RightBar: React.FC = () => {
  return (
    <div className="right-bar">
      <SearchBar />
      <Trending />
      <SuggestionFollow />
    </div>
  );
};

export default RightBar;
