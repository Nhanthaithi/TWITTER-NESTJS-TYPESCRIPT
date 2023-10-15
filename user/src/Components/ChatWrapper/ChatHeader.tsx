// ChatHeader.tsx

import { Images } from "../../Assets/images";

const ChatHeader = () => (
  <div className="chat-header">
    <img src={Images.Notfound} alt="User Name" />
    <div className="details">
      <div className="name">Full Name</div>
      <div className="username">@username</div>
    </div>
  </div>
);

export default ChatHeader;
