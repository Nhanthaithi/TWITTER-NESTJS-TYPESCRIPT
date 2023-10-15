import "./ManagerTweets.css";

import { useEffect, useState } from "react";

import BaseAxios from "../../API/axiosClient";
import { ITweetLocal } from "../../Types/types";

const ManageTweets = () => {
  const [tweetsList, setTweetsList] = useState<ITweetLocal[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchTweets = async (page: number) => {
    const response = await BaseAxios.get(
      `/api/v1/tweets/alltweets?page=${page}`
    );

    setTweetsList(response.data.tweets);
    setTotalPages(response.data.totalPages);
  };

  useEffect(() => {
    fetchTweets(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDeleteTweet = async (tweet: ITweetLocal) => {
    try {
      await BaseAxios.delete(`/api/v1/tweets/${tweet._id}`);
      // Sau khi xóa tweet, gọi hàm fetchTweets để cập nhật danh sách tweet
      fetchTweets(currentPage);
    } catch (error) {
      console.log("Error deleting tweet:", error);
    }
  };

  return (
    <div className="manager-tweets p-4">
      <h3 className="font-bold text-center my-3">MANAGEMENT TWEETS</h3>

      <table className="min-w-full border-t border-gray-200 divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Fullname User Post
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Type Tweet
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Post Time
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Content tweets
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Image Tweets
            </th>
            <th className="px-6 py-3 text-left text-xs border border-gray-200 font-medium text-gray-500 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {useState.length > 0 &&
            tweetsList.map((tweet, index) => (
              <tr className="hover:bg-gray-200" key={tweet?._id}>
                <td className="px-6 py-4 border border-gray-200 ">
                  {(currentPage - 1) * 10 + index + 1}
                </td>
                <td className="px-6 py-4 border border-gray-200">
                  {tweet?.author?.fullname}
                </td>
                <td className="px-6 py-4 border border-gray-200">
                  {tweet?.author?.email}
                </td>
                <td className="px-6 py-4 border border-gray-200">
                  {tweet?.type}
                </td>
                <td className="px-6 py-4 border border-gray-200">
                  {tweet?.createdAt}
                </td>
                <td className="px-6 py-4 border border-gray-200">
                  {tweet?.content}
                </td>
                <td className="px-6 py-4 border border-gray-200">
                  {tweet?.medias?.map((media, index) => (
                    <img
                      src={media}
                      alt="img-tweet"
                      className="image-tweet"
                      key={index}
                    />
                  ))}
                </td>
                <td className="px-6 py-4 border border-gray-200">
                  <button
                    className="bg-red-500 rounded-lg px-5 py-1 text-white font-bold"
                    onClick={() => handleDeleteTweet(tweet)}
                  >
                    Delete Tweet
                  </button>
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

export default ManageTweets;
