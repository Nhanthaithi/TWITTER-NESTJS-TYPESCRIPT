import "./NotificationComponent.css";

import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import BaseAxios from "../../API/axiosConfig";
import { INotification } from "../../Types/type";

const NotificationComponent = () => {
  const [activeTab, setActiveTab] = useState("All");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  const [notifications, setNotifications] = useState<INotification[]>([]);

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
      const response = await BaseAxios.get("/api/v1/notifications"); // Đổi đường dẫn API tới địa chỉ phù hợp
      const notifications = response.data;

      setNotifications(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // console.log(notifications);

  return (
    <div className="notifications-container border border-gray">
      <h4 className="p-2 font-bold text-xl">Notifications</h4>
      <div className="notification-menu">
        <div
          className={`menu-item ${activeTab === "All" ? "active" : ""}`}
          onClick={() => handleTabClick("All")}
        >
          All
        </div>
        <div
          className={`menu-item ${activeTab === "Verified" ? "active" : ""}`}
          onClick={() => handleTabClick("Verified")}
        >
          Verified
        </div>
        <div
          className={`menu-item ${activeTab === "Mention" ? "active" : ""}`}
          onClick={() => handleTabClick("Mention")}
        >
          Mention
        </div>
      </div>

      {notifications.length > 0 &&
        notifications.map((notification, index) => (
          <div className="notification" key={index}>
            <>
              <div className="flex items-center me-4">
                <Link
                  to={`/profile/${notification.senderId?._id}`}
                  className="avatar"
                >
                  <img src={notification.senderId?.avatar} alt="Avatar" />
                </Link>
                <Link to={`/profile/${notification.senderId?._id}`}>
                  <span className="fullname">
                    {notification.senderId?.fullname}
                  </span>
                  <p className="username text-gray-400 font-bold text-sm">
                    @{notification.senderId?.username}
                  </p>
                  <span className="date">
                    {formatTimestamp(notification?.createdAt)}
                  </span>
                </Link>
              </div>

              <div className="notification-content">
                <div className="content font-medium">
                  <Link
                    to={`/post-detail/${notification.tweetId}`}
                    className="mx-2"
                  >
                    {notification.type == "like"
                      ? "Liked your tweet"
                      : notification.type === "comment"
                      ? "Replied your tweet"
                      : "Post a new Tweet"}
                  </Link>
                </div>
              </div>
            </>
          </div>
        ))}
    </div>
  );
};

export default NotificationComponent;
