import { toast } from "react-toastify";

import BaseAxios from "../API/axiosConfig";

// GET USER BY ID FROM API
export const fetchUserById = async (id: string | undefined) => {
  //Fetch User Profile
  try {
    const response = await BaseAxios.get(`/api/v1/users/${id}`);
    const user = response.data.user;
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

//FETCH USER CURRENT FROM API
export const fetchCurrentUser = async () => {
  try {
    const response = await BaseAxios.get("/api/v1/users/current-user");
    return response.data.user;
  } catch (error) {
    console.error("Error fetching current user:", error);
  }
};

//Update current user
export const fetchUpdateUser = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("accessToken") || "";
    if (!token) {
      throw new Error("No token found");
    }
    const response = await BaseAxios.patch(
      "/api/v1/users/update-user",
      formData
    );

    if (response.status === 200) {
      return response.data.user;
    }
  } catch (error) {
    console.error("There was an error updating the user profile:", error);
  }
};

//GET ALL RELEVANT TWEETS
export const getRelevantTweets = async () => {
  try {
    const response = await BaseAxios.get("/api/v1/tweets");
    return response.data.tweets;
  } catch (error) {
    console.error("Error fetching relevant tweets:", error);
    throw new Error("Failed to fetch relevant tweets");
  }
};

// POST NEW TWEET
export const postNewTweet = async (data: {
  content: string;
  images: File[];
}) => {
  try {
    const formData = new FormData();
    formData.append("content", data.content);
    data.images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await BaseAxios.post("/api/v1/tweets", formData);
    return response.data;
  } catch (error) {
    console.error("Error posting new tweet:", error);
    throw new Error("Failed to post new tweet");
  }
};

//CHECK FOLLOWING CỦA CURRENT USER
export const checkFollowing = async (tweetAuthorId: string) => {
  try {
    const response = await BaseAxios.get(
      `/api/v1/follow/checkFollow/${tweetAuthorId}`
    );
    return response.data.isFollowing;
  } catch (error) {
    console.log("Error checking if following:", error);
  }
};

// LOGIN WITH GOOGLE
export const loginWithGoogle = async () => {
  try {
    // Khai báo thông số cho cửa sổ popup
    const width = 600;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    // Mở cửa sổ popup
    const popup = window.open(
      "http://localhost:8000/api/v1/users/google",
      "Login with Google",
      `toolbar=no, location=no, directories=no, status=no, menubar=no,
       scrollbars=yes, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );

    // Lắng nghe sự kiện chuyển hướng của popup
    const checkInterval = setInterval(async () => {
      try {
        if (!popup || popup.closed || popup.closed === undefined) {
          clearInterval(checkInterval);
          toast.error("Login popup was closed.", {
            position: toast.POSITION.TOP_RIGHT,
          });
          return;
        }

        if (popup.location.href.includes("localhost:3000")) {
          clearInterval(checkInterval);
          popup.close();

          // Xử lý sau khi nhận token
          const url = new URL(popup.location.href);
          const accessToken = url.searchParams.get("token");

          if (accessToken) {
            localStorage.setItem("accessToken", accessToken);

            // Lấy thông tin người dùng từ server
            const user = await fetchCurrentUser();
            if (user) {
              localStorage.setItem("userLogin", JSON.stringify(user));
            }

            toast.success("Successfully logged in with Google!", {
              position: toast.POSITION.TOP_RIGHT,
            });
            window.location.href = "/home";
          } else {
            toast.error("Error during Google authentication.", {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
      } catch (error) {
        // Tránh lỗi security khi truy cập cross-origin
        console.log(error);
      }
    }, 1000);
  } catch (error) {
    console.log(error);
    toast.error("Login with Google failed.", {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
};
//UPDATE USER VERIFY
export const updateUserVerify = async (verify: object) => {
  try {
    const response = await BaseAxios.patch("/api/v1/users/verify", verify);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const createBlockedUser = async (blockedUserId: string) => {
  const body = {
    blockedUserId: blockedUserId,
  };
  const response = await BaseAxios.post(`/api/v1/blocked-users`, body);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const isBlocked = async (blockedUserId: string) => {
  const body = {
    blockedUserId: blockedUserId,
  };
  const response = await BaseAxios.post(
    `/api/v1/blocked-users/is-blocked`,
    body
  );
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
//GET BLOCKED USER FOR CURRENT USER
export const getBlockedUser = async () => {
  const response = await BaseAxios.get(`/api/v1/blocked-users`);
  return response.data;
};
//HANDLE UNBLOCKED USER
export const unblockUser = async (blockedUserId: string) => {
  const body = {
    blockedUserId: blockedUserId,
  };
  const response = await BaseAxios.delete(`/api/v1/blocked-users/unblock`, {
    data: body,
  });
  return response.data;
};
