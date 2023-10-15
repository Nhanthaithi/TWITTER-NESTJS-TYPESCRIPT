import { Route, Routes } from "react-router-dom";

import Login from "../Components/Login/Login";
import Register from "../Components/Register/Register";
import RequireAuth from "../Components/RequireAuth/RequireAuth";
import Auth from "../Layouts/Auth/Auth";
import BlockedUser from "../Layouts/BlockedUser/BlockedUser";
import Home from "../Layouts/Home/Home";
import MessagesLayout from "../Layouts/Messages/Messages";
import Notification from "../Layouts/Notifications/Notification";
import Profile from "../Layouts/Profile/Profile";
import TweetDetail from "../Layouts/TweetDetail/TweetDetail";
import Verify from "../Layouts/Verify/Verify";
import NotFound from "../Pages/Notfound/NotFound";

const Router = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />}>
        <Route path="login" index element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route element={<RequireAuth />}>
        <Route path="/home" element={<Home />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/post-detail/:id" element={<TweetDetail />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/notifications" element={<Notification />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/profile/:id" element={<Profile />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/messages" element={<MessagesLayout />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/verify" element={<Verify />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/block-user" element={<BlockedUser />} />
      </Route>

      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default Router;
