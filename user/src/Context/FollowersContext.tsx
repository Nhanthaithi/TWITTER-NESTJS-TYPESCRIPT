import { createContext, useContext, useState } from "react";

import { IUser } from "../Types/type";

interface IFollowersContext {
  followers: IUser[];
  setFollowers: React.Dispatch<React.SetStateAction<IUser[]>>;
}

const FollowersContext = createContext<IFollowersContext | undefined>(
  undefined
);

interface Props {
  children: React.ReactNode;
}

export const FollowersProvider: React.FC<Props> = ({ children }) => {
  const [followers, setFollowers] = useState<IUser[]>([]);

  return (
    <FollowersContext.Provider value={{ followers, setFollowers }}>
      {children}
    </FollowersContext.Provider>
  );
};

export const useFollowers = () => {
  const context = useContext(FollowersContext);
  if (!context) {
    throw new Error("useFollowers must be used within a FollowersProvider");
  }
  return context;
};
