import React from "react";

import LeftBar from "../../Components/Common/LeftBar/LeftBar";
import RightBar from "../../Components/Common/RightBar/RightBar";
import ProfileComponent from "../../Components/ProfileComponent/ProfileComponent";

const Profile = () => {
  return (
    <div className="profile container flex justify-between align-items-center">
      <LeftBar />
      <ProfileComponent />
      <RightBar />
    </div>
  );
};

export default Profile;
