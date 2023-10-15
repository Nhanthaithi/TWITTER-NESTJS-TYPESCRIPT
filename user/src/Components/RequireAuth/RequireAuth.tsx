import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import ExpNotify from "../ExpiNotify/ExpyNotify";

const RequireAuth = () => {
  interface IDecodedToken {
    exp: number;
    // Các thuộc tính khác của token nếu có
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token: any = localStorage.getItem("accessToken");
  // lấy token từ localStorage về JSON.parse(...)
  // console.log(token);

  const [exp, setExp] = useState(false); //set trạng thái để hiện popup hết phiên đăng nhập
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const date = new Date();
      const decode = jwtDecode(token) as IDecodedToken;
      if (decode && decode.exp > date.getTime() / 1000) {
        //néu token còn hạng thì chỉ chuyển hướng trang vào outlet
        setExp(false);
        // console.log(1111, decode);
      } else {
        // nếu hết hạng thì hiện popup thông báo hết phiên
        setExp(true);
        console.log(222222222, "Token Expired");
      }
    } catch (error) {
      // nếu cố ý nhập bậy token thì cho về login
      navigate("/");
      console.log(error, "Token wrong");
    }
  }, []);

  return (
    <>
      {exp && <ExpNotify />}
      <Outlet />
    </>
  );
};

export default RequireAuth;
