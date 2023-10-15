import "./BlockedUserComponent.css";
import "react-toastify/dist/ReactToastify.css";

import moment from "moment";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import { IBlockedUser } from "../../Types/type";
import { getBlockedUser, unblockUser } from "../../Utils/commonFunction";

const BlockedUserComponent = () => {
  const [notifications, setNotifications] = useState<IBlockedUser[]>([]);

  // Hàm hỗ trợ để định dạng thời gian đăng bài post
  const formatTimestamp = (timestamp: string | Date): string => {
    // console.log(timestamp);
    const date = moment(timestamp); // Tạo đối tượng moment từ timestamp
    const now = moment(); // Đối tượng moment hiện tại
    if (now.diff(date, "days") < 1) {
      // Nếu chưa đủ 1 ngày
      return date.fromNow(); // Hiển thị dưới dạng "x phút trước", "vài giây trước",...
    } else {
      return date.format("DD/MM/YYYY"); // Hiển thị dưới dạng "ngày/tháng"
    }
  };

  const fetchNotifications = async () => {
    try {
      const listBlockedUser = await getBlockedUser(); // Đổi đường dẫn API tới địa chỉ phù hợp
      setNotifications(listBlockedUser);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleUnblock = async (blockedUserId: string) => {
    try {
      await unblockUser(blockedUserId);
      // console.log(data);
      fetchNotifications();
      toast.success("This account is unblocked successfully.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="block-container border border-gray">
      <ToastContainer />
      <h4 className="p-2 font-bold text-xl">Blocked List Users </h4>
      {notifications.length > 0 &&
        notifications.map((notification, index) => (
          <div className="block justify-between items-center" key={index}>
            <>
              <div className="flex items-center me-4">
                <div className="avatar">
                  <img src={notification.blockedUserId?.avatar} alt="Avatar" />
                </div>
                <div>
                  <span className="fullname">
                    {notification.blockedUserId?.fullname}
                  </span>
                  <p className="username text-gray-400 font-bold text-sm">
                    @{notification.blockedUserId?.username}
                  </p>
                  <span className="date">
                    {formatTimestamp(notification?.createdAt)}
                  </span>
                </div>
              </div>
              <div className="block-content">
                <button
                  className="rounded-full bg-blue-500 text-white px-3  py-1 font-bold"
                  onClick={() => handleUnblock(notification.blockedUserId?._id)}
                >
                  Unblock this User
                </button>
              </div>
            </>
          </div>
        ))}
    </div>
  );
};

export default BlockedUserComponent;
