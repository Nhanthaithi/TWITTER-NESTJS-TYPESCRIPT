import React from "react";

import LeftBar from "../../Components/Common/LeftBar/LeftBar";
import RightBar from "../../Components/Common/RightBar/RightBar";
import NotificationComponent from "../../Components/NotificationComponent/NotificationComponent";

const Notification = () => {
  return (
    <div className="notifications container flex justify-between align-items-center">
      <LeftBar />
      <NotificationComponent />
      <RightBar />
    </div>
  );
};

export default Notification;
