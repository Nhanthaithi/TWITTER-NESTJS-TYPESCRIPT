import React from "react";

import ChatWrapper from "../../Components/ChatWrapper/ChatWrapper";
import LeftBar from "../../Components/Common/LeftBar/LeftBar";

const MessagesLayout: React.FC = () => {
  return (
    <div className="messages-layout container flex justify-between align-items-center">
      <LeftBar />
      <ChatWrapper />
    </div>
  );
};

export default MessagesLayout;
