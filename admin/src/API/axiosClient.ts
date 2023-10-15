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
BaseAxios.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("accessToken") || "";
    try {
      const date = new Date(); //Tạo ngày giờ hiện tại kiểm tra
      const decodedTokenRaw = jwtDecode(token);
      const decodedToken = decodedTokenRaw as { exp: number };
      // console.log(decodedToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        const newToken = await refreshToken();
        console.log(newToken);

        token = newToken;
      }
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
