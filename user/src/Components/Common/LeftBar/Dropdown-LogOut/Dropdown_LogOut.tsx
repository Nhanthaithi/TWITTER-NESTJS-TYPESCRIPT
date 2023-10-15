import "./DropDown_Logout.css";

import { Link, useNavigate } from "react-router-dom";

import { Button, DropdownMenu } from "@radix-ui/themes";

import Profile from "../../../../Layouts/Profile/Profile";
import { IDropdownBottomLefBar } from "../../../../Types/type";

function Dropdown_LogOut({ currentUser }: IDropdownBottomLefBar) {
  const handleLogout = () => {
    // 1. Xoá JWT khỏi localStorage (hoặc sessionStorage/cookies tùy theo bạn lưu ở đâu)
    window.location.href = "/";
  };
  const navigate = useNavigate();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft" size="1" color="red">
          ...
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        size="1"
        side="top"
        className="custom-dropdown-content"
      >
        <DropdownMenu.Item
          shortcut="⌘ E"
          className="font-bold"
          onClick={() => {
            navigate(`/profile/${currentUser?._id}`);
          }}
        >
          {/* <Link to={`/profile/${currentUser?._id}`}>My Profile</Link> */}
          My Profile
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          shortcut="⌘ ⌫"
          color="red"
          className="font-bold"
          onClick={handleLogout}
        >
          Log Out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export default Dropdown_LogOut;
