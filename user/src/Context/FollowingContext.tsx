import React, { createContext, useContext, useState } from "react";

import { IUser } from "../Types/type";

interface FollowingContextProps {
  followings: IUser[];
  setFollowings: React.Dispatch<React.SetStateAction<IUser[]>>;
}

const FollowingContext = createContext<FollowingContextProps | undefined>(
  undefined
);

export const useFollowing = () => {
  const context = useContext(FollowingContext);
  if (!context) {
    throw new Error("useFollowing must be used within a FollowingProvider");
  }

  return context;
};

interface Props {
  children: React.ReactNode;
}

export const FollowingProvider: React.FC<Props> = ({ children }) => {
  const [followings, setFollowings] = useState<IUser[]>([]);

  return (
    <FollowingContext.Provider value={{ followings, setFollowings }}>
      {children}
    </FollowingContext.Provider>
  );
};
