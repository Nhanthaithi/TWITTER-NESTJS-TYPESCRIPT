import "./SuggestionList.css";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import BaseAxios from "../../../../API/axiosConfig";
import { IUser, SearchList } from "../../../../Types/type";

const SuggestionsList: React.FC<SearchList> = (prop: SearchList) => {
  const { searchWord, setIsFocused } = prop;
  const [searchResults, setSearchResults] = useState<IUser[]>([]);

  const searchUsers = async (keyword: string) => {
    try {
      const response = await BaseAxios.get(
        `/api/v1/users/search?query=${keyword}`
      );

      setSearchResults(response.data.users); // response.data là danh sách kết quả từ API
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  useEffect(() => {
    if (searchWord) {
      // Gọi API để tìm kiếm người dùng theo tên hoặc email
      searchUsers(searchWord);
    } else {
      setSearchResults([]);
    }
  }, [searchWord]);

  return (
    <ul className="suggestions-list font-bold text-sm">
      {searchResults.length > 0
        ? // Fake data. Thực tế có thể fetch từ API
          searchResults.map((user) => (
            <li
              key={user?._id}
              className="my-4"
              onClick={() => setIsFocused(true)}
            >
              <Link to={`/profile/${user._id}`} className="flex items-center">
                <img
                  src={user?.avatar}
                  alt="avt"
                  className="w-10 h-10 rounded-full me-2"
                />
                <div>
                  <p className="text-sm font-bold m-0">{user?.fullname}</p>
                  <p className="text-sm text-gray-400 font-bold m-0">
                    {user?.username}
                  </p>
                </div>
              </Link>
            </li>
          ))
        : "Enter Twitter username or fullname or email"}
    </ul>
  );
};

export default SuggestionsList;
