import "./BottomLeftBar.css";

import { useUser } from "../../../Context/UserContext";
import Dropdown_LogOut from "./Dropdown-LogOut/Dropdown_LogOut";

const BottomLeftBar = () => {
  const { user: currentUser } = useUser();

  // useEffect(() => {
  //   fetchCurrentUser().then(setCurrentUser);
  // }, []);

  // console.log(currentUser);

  return (
    <div className="bottom-sidebar">
      <div className="loginUser-info">
        <div className="userAlphabet">
          <img src={currentUser?.avatar} alt="avt" className="avt-user" />
        </div>
        <div className="username-content">
          <b className="emailname_info text-sm">{currentUser?.fullname}</b>
          <p className="username-info m-0 text-secondary text-sm text-slate-400">
            @{currentUser?.username}
          </p>
        </div>
      </div>
      <Dropdown_LogOut currentUser={currentUser} />
    </div>
  );
};

export default BottomLeftBar;
