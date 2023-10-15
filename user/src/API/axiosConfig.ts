import axios from "axios";
import jwtDecode from "jwt-decode"; // Import jwt_decode

const BaseAxios = axios.create({
  baseURL: "http://localhost:8000",
  // headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  // },
});
BaseAxios.defaults.withCredentials = true;
axios.defaults.withCredentials = true;

const refreshToken = async () => {
  try {
    const res = await axios.post(
      "http://localhost:8000/api/v1/users/refresh-token",
      {
        withCredentials: true,
      }
    );
    // console.log(res.data);
    localStorage.setItem("accessToken", res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
//Tạo hàm refresh Token
let isRefreshing = false; // Biến cờ để kiểm tra xem cuộc gọi refreshToken đã được thực hiện hay chưa
let refreshPromise: Promise<any> | null = null; // Biến lưu trữ promise của cuộc gọi refreshToken
BaseAxios.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("accessToken") || "";
    try {
      const date = new Date(); //Tạo ngày giờ hiện tại kiểm tra
      const decodedTokenRaw = jwtDecode(token);
      const decodedToken = decodedTokenRaw as { exp: number };
      // console.log(decodedToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        // const newToken = await refreshToken();
        // console.log(newToken);
        // token = newToken;
        //Kiểm tra xem giờ hết hạn token vs giờ hiện tại nếu hết thì phải gọi refreshToken để nhận token mới
        if (!isRefreshing) {
          // Nếu chưa có cuộc gọi refreshToken nào được thực hiện
          isRefreshing = true; // Đánh dấu rằng đang thực hiện cuộc gọi refreshToken
          // Tạo promise cho cuộc gọi refreshToken
          refreshPromise = refreshToken()
            .then((data) => {
              token = data;
            })
            .finally(() => {
              isRefreshing = false; // Sau khi thực hiện xong, đặt lại biến cờ
              refreshPromise = null; // Đặt lại promise thành null
            });
        }
      }
      // Chờ cho đến khi promise của refreshToken hoàn thành
      await refreshPromise;
    } catch (e) {
      console.log(e);
    }
    if (token !== null) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
// after send request
BaseAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default BaseAxios;
