import React, { createContext, ReactNode, useContext, useState } from "react";

import { ITweetLocal } from "../Types/type";

interface TweetContextProps {
  tweets: ITweetLocal[];
  setTweets: React.Dispatch<React.SetStateAction<ITweetLocal[]>>;
  resetTweets: () => void; // Thêm dòng này
}

const TweetContext = createContext<TweetContextProps | undefined>(undefined);

export const useTweets = () => {
  const context = useContext(TweetContext);
  if (!context) {
    throw new Error("useTweets must be used within a TweetProvider");
  }
  return context;
};

export const TweetProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tweets, setTweets] = useState<ITweetLocal[]>([]);

  const resetTweets = () => {
    setTweets([]); // Đặt tweets về mảng rỗng
  };

  return (
    <TweetContext.Provider value={{ tweets, setTweets, resetTweets }}>
      {children}
    </TweetContext.Provider>
  );
};
