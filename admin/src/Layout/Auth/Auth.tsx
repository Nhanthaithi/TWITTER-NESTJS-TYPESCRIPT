import "./Auth.css";

import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayOut = () => {
  return (
    <div className="AuthLayout">
      <Outlet />
    </div>
  );
};

export default AuthLayOut;
