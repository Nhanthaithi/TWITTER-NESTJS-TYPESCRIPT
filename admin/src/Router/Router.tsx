import { Route, Routes } from "react-router-dom";

import Dashboard from "../Components/Dashboard/Dashboard";
import Login from "../Components/Login/Login";
import ManageOrder from "../Components/ManagerOrder/ManagerOrder";
import ManageTweets from "../Components/ManagerTweets/ManagerTweets";
import ManageUser from "../Components/ManagerUser/ManagerUser";
import RequireAuth from "../Components/RequireAuth/RequireAuth";
import AuthLayOut from "../Layout/Auth/Auth";
import Content from "../Layout/Content/Content";

const Router = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayOut />}>
        <Route path="login" index element={<Login />} />
      </Route>
      <Route path="/" element={<Content />}>
        <Route element={<RequireAuth />}>
          <Route path="manager-users" index element={<ManageUser />} />
          <Route path="manager-tweets" index element={<ManageTweets />} />
          <Route path="manager-orders" index element={<ManageOrder />} />
          <Route path="" index element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
