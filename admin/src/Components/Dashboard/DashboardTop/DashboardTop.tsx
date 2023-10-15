import "./DashbaordTop.css";

import React, { useEffect, useState } from "react";
import { BiMovie, BiMoviePlay, BiUserCheck, BiUserPlus } from "react-icons/bi";

import BaseAxios from "../../../API/axiosClient";
import { IRevenue } from "../../../Types/types";

const DasboardContentTop: React.FC = () => {
  const [managerLengthUsers, setManagerLengthUsers] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const handleManagerUsers = async () => {
    try {
      const resepone = await BaseAxios.get("/api/v1/users");
      console.log(resepone.data.meta.totalUsers);
      setManagerLengthUsers(resepone.data.meta.totalUsers);
    } catch (error) {
      console.error(error);
    }
  };
  const handleManagerProducts = async () => {
    try {
      const resepone = await BaseAxios.get("/api/v1/revenues");
      //   console.log(resepone);

      const totalRevenue = resepone.data.reduce(
        (sum: number, item: IRevenue) => sum + item.price,
        0
      );
      setRevenue(totalRevenue);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    handleManagerUsers();
    handleManagerProducts();
  }, []);
  return (
    <div>
      <div className="top-section">
        <h4 className="top-section-title">Welcome! Dashboard</h4>
        <div className="wrapper-card">
          <div className="card-dashboard-item">
            <div className="card-dashboard-item-1 box-1">
              <span>ALL USERS</span>
              <span>{managerLengthUsers}</span>
            </div>
            <div className="card-dashboard-item-2 box-2">
              <BiUserCheck className="card-icons" />
            </div>
          </div>
          <div className="card-dashboard-item">
            <div className="card-dashboard-item-1 box-3">
              <span> REVENUE</span>
              <span>{revenue}</span>
            </div>
            <div className="card-dashboard-item-2 box-4">
              <BiUserPlus className="card-icons" />
            </div>
          </div>
          <div className="card-dashboard-item">
            <div className="card-dashboard-item-1 box-5">
              <span>TWEETS</span>
              <span>{0}</span>
            </div>
            <div className="card-dashboard-item-2 box-6">
              <BiMoviePlay className="card-icons" />
            </div>
          </div>
          <div className="card-dashboard-item">
            <div className="card-dashboard-item-1 box-7">
              <span>PAID MOVIES</span>
              <span>{0}</span>
            </div>
            <div className="card-dashboard-item-2 box-8">
              <BiMovie className="card-icons" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DasboardContentTop;
