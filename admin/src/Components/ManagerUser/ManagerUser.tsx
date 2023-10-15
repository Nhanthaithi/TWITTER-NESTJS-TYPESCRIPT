import "./ManagerUser.css"; // Bạn có thể muốn chỉnh sửa hoặc xóa file này nếu không cần thiết

import { useEffect, useState } from "react";

import BaseAxios from "../../API/axiosClient";
import { IUser } from "../../Types/types";

const ManageUser = () => {
  const [userList, setUserList] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const fetchUsers = async (page: number, limit: number = 10) => {
    const response = await BaseAxios.get(
      `/api/v1/users/?page=${page}&limit=${limit}`
    );
    setUserList(response.data.data);
    setTotalPages(response.data.meta.totalPages);
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleBlockUser = async (user: IUser) => {
    await updateUserStatus(user._id, 0);
  };

  const handleActiveUser = async (user: IUser) => {
    await updateUserStatus(user._id, 1);
  };

  const updateUserStatus = async (userId: string, newStatus: number) => {
    try {
      await BaseAxios.patch(`/api/v1/users/${userId}/status`, {
        status: newStatus,
      });
      fetchUsers(currentPage);
    } catch (error) {
      console.log("Error updating user status:", error);
    }
  };
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="manager-user p-4">
      <h3 className="font-bold text-center my-3">MANAGEMENT USER</h3>

      <table className="min-w-full border-t border-gray-200 divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Fullname
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {useState.length > 0 &&
            userList.map((user, index) => (
              <tr className="hover:bg-gray-200" key={user._id}>
                <td className="px-6 py-4 border border-gray-200 ">
                  {index + 1}
                </td>
                <td className="px-6 py-4 border border-gray-200">
                  {user.fullname}
                </td>
                <td className="px-6 py-4 border border-gray-200">
                  {user.username}
                </td>
                <td className="px-6 py-4 border border-gray-200">
                  {user.email}
                </td>
                <td className="px-6 py-4 border border-gray-200">
                  {user.role == 0 && "User"}
                </td>
                <td className="px-6 py-4 border border-gray-200">
                  {user.status ? (
                    <button
                      className="bg-green-500 rounded-lg px-5 py-1 text-white font-bold"
                      onClick={() => handleBlockUser(user)}
                    >
                      Active
                    </button>
                  ) : (
                    <button
                      className="bg-red-500 rounded-lg px-5 py-1 text-white font-bold"
                      onClick={() => handleActiveUser(user)}
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-center my-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`mx-1 px-3 py-2 border rounded-full w-10 h-10 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageUser;
