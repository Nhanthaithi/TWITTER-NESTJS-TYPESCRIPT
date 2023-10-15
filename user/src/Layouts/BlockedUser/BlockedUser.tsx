import BlockedUserComponent from "../../Components/BlockedUserComponent/BlockedUserComponent";
import LeftBar from "../../Components/Common/LeftBar/LeftBar";
import RightBar from "../../Components/Common/RightBar/RightBar";

const BlockedUser = () => {
  return (
    <div className="blocked-user container flex justify-between align-items-center">
      <LeftBar />
      <BlockedUserComponent />
      <RightBar />
    </div>
  );
};

export default BlockedUser;
