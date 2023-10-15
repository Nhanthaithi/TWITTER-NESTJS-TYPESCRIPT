import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../Components/Sidebar/SideBar";

const Content = () => {
  return (
    <div className="content flex">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Content;
