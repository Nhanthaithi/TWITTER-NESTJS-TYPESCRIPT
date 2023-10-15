import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const RequireAuth = () => {
  interface IDecodedToken {
    exp: number;
    userRole: number;
    // Các thuộc tính khác của token nếu có
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token: any = localStorage.getItem("accessToken");

  const [exp, setExp] = useState(false); //set trạng thái để hiện popup hết phiên đăng nhập
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const date = new Date();
      const decode = jwtDecode(token) as IDecodedToken;
      if (
        decode &&
        decode.exp > date.getTime() / 1000 &&
        decode.userRole === 1
      ) {
        //néu token còn hạng thì chỉ chuyển hướng trang vào outlet
        setExp(false);
        // console.log(1111, decode);
      } else {
        // nếu hết hạng thì về trang login
        setExp(true);
        console.log(222222222, "Token Expired");
      }
    } catch (error) {
      // nếu cố ý nhập bậy token thì cho về login
      navigate("/auth/login");
      console.log(error, "Token wrong");
    }
  }, []);

  if (exp) {
    // Nếu hết hạn, chuyển hướng đến trang đăng nhập
    return <Navigate to="/auth/login" replace />;
  }
  // Nếu còn hạn, cho phép truy cập route con
  return <Outlet />;
};

export default RequireAuth;
