// Messages.tsx
import React from "react";

const Messages = () => {
  //   const messages = []; // This should come from props or API
  return (
    <div className="messages">
      {/* {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.own ? "own" : "other"}`}
        >
          {message.content}
        </div>
      ))} */}
      <div className={`message own`}>{"i chating"}</div>
      <div className={`message other`}>{"client chating"}</div>
      <div className={`message own`}>{"i chatinghghfjhjhhhj"}</div>
      <div className={`message other`}>{"client chatingfdsfdfdff"}</div>
    </div>
  );
};

export default Messages;
