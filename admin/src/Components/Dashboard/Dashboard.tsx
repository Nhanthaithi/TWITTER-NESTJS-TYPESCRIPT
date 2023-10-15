import "./Dashboard.css";

import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

import BaseAxios from "../../API/axiosClient";
import DasboardContentTop from "./DashboardTop/DashboardTop";

const Dashboard = () => {
  const fetchRevenueData = async () => {
    try {
      const response = await BaseAxios.get("/api/v1/revenues");
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchUserData = async () => {
    const allUsers = [];
    let currentPage = 1;

    while (true) {
      try {
        const response = await BaseAxios.get("/api/v1/users", {
          params: {
            page: currentPage,
          },
        });

        // Thêm dữ liệu người dùng từ trang hiện tại vào danh sách
        if (response.data && response.data.data) {
          allUsers.push(...response.data.data);
        }

        // Kiểm tra xem có cần lấy thêm trang tiếp theo không
        if (currentPage >= response.data.meta.totalPage) {
          break;
        }

        currentPage++;
      } catch (error) {
        console.error(
          `Error fetching user data for page ${currentPage}:`,
          error
        );
        break;
      }
    }

    return allUsers;
  };

  const processMonthlyData = (
    data: any[],
    isRevenue: boolean = false
  ): Map<string, number> => {
    const monthlyData: Map<string, number> = new Map();
    data.forEach((item) => {
      const month = new Date(item.createdAt).getMonth() + 1;
      const year = new Date(item.createdAt).getFullYear();
      const key = `${month}-${year}`;
      const prevSum = monthlyData.get(key) || 0;
      if (isRevenue) {
        monthlyData.set(key, prevSum + item.price);
      } else {
        monthlyData.set(key, prevSum + 1); // Đối với người dùng, là đếm
      }
    });

    return monthlyData;
  };

  const currentYear = new Date().getFullYear();
  const initializeFullYearData = () => {
    const data = new Map();
    for (let i = 1; i <= 12; i++) {
      data.set(`${i}-${currentYear}`, 0);
    }
    return data;
  };

  const [revenueData, setRevenueData] = useState<Map<string, number>>(
    initializeFullYearData()
  );
  const [userData, setUserData] = useState<Map<string, number>>(
    initializeFullYearData()
  );

  useEffect(() => {
    const fetchData = async () => {
      const revenue = await fetchRevenueData();
      const users = await fetchUserData();
      const processedRevenue = processMonthlyData(revenue, true);
      const processedUsers = processMonthlyData(users);
      setRevenueData(processedRevenue);
      setUserData(processedUsers);
    };

    fetchData();
  }, []);

  // Tạo một mảng `sortedKeys` chứa các khóa từ tháng 1 đến tháng 12 của năm hiện tại:
  const sortedKeys = Array.from(
    { length: 12 },
    (_, i) => `${i + 1}-${currentYear}`
  );

  return (
    <div className="dashboard-wrapper">
      <DasboardContentTop />

      <div className="chart-container">
        {/* Biểu đồ Doanh thu */}
        <Chart
          className="chart"
          height={"300px"}
          chartType="LineChart"
          loader={<div>Loading Revenue Chart</div>}
          data={[
            ["Month", "Revenue"],
            ...sortedKeys.map((key) => {
              return [key, revenueData.get(key) || 0];
            }),
          ]}
          options={{
            title: "Monthly Revenue",
            vAxis: {
              title: "Revenue",
            },
            hAxis: {
              title: "Month",
            },
            colors: ["#2175f5"],
            titleTextStyle: {
              fontSize: 24,
            },
            pointSize: 5, // Đã thêm vào
            pointShape: "circle", // Đã thêm vào
          }}
        />

        {/* Biểu đồ Người dùng mới */}
        <Chart
          className="chart"
          height={"300px"}
          chartType="ColumnChart"
          loader={<div>Loading User Chart</div>}
          data={[
            ["Month", "New Users"],
            ...sortedKeys.map((key) => {
              return [key, userData.get(key) || 0];
            }),
          ]}
          options={{
            title: "Monthly New Users",
            vAxis: {
              title: "New Users",
            },
            hAxis: {
              title: "Month",
            },
            colors: ["#33a532"],
            bar: { groupWidth: "90%" },
            titleTextStyle: {
              fontSize: 24,
            },
          }}
        />
      </div>
    </div>
  );
};
export default Dashboard;
