import "./Login.css";
import "react-toastify/dist/ReactToastify.css";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import GoogleButton from "react-google-button";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import BaseAxios from "../../API/axiosConfig";
import { login } from "../../Redux/Reducer/userSlice";
import { AppDispatch } from "../../Redux/Store/store";
import { loginWithGoogle } from "../../Utils/commonFunction";

const Login = () => {
  const dispatch: AppDispatch = useDispatch();
  const [inputValue, setInputValue] = useState({ email: "", password: "" });
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      BaseAxios.post(`/api/v1/users/logout`)
        .then(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userLogin");
          document.cookie = `refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        })
        .catch((err) => console.log(err));
    }
  }, []);
  //LOGIN NORMAL
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await dispatch(login(inputValue)).unwrap();
      const { user } = response;
      if (user.status && user.type_login == 1) {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("userLogin", JSON.stringify(response.user));
        window.location.href = "/home";
        setInputValue({ email: "", password: "" });
      } else if (!user.status) {
        toast.error("Your account is blocked.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      } else if (user.type_login == 2) {
        toast.error("Your account is login with Google.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Invalid email or password.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error("Login failed:", error);
      // Handle error: show a notification, set an error state, etc.
    }
  };
  //LOGIN WITH GOOGLE
  const handleLoginGoogle = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="login">
      <ToastContainer />
      <div className="login-top">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="r-k200y r-1cvl2hr r-4qtqp9 r-yyyyoo 
          r-5sfk15 r-dnmrzs r-kzbkwu r-bnwqim r-1plcrui r-lrvibr fill-blue-500"
        >
          <g>
            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
          </g>
        </svg>
      </div>
      <h3 className="font-bold text-blue-500 text-xl">
        LOGIN WITH YOUR ACCOUNT
      </h3>
      <form className="login-form" method="post" onSubmit={handleLogin}>
        <div className="form-group">
          <input
            type="email"
            id="login-email"
            name="email"
            onChange={handleInput}
            value={inputValue.email}
          />
          <label htmlFor="login-email">
            Email <sup className="text-danger">*</sup>
          </label>
        </div>
        <div className="form-group">
          <input
            type="password"
            id="login-password"
            name="password"
            onChange={handleInput}
            value={inputValue.password}
          />
          <label htmlFor="login-password">
            Password <sup className="text-danger">*</sup>
          </label>
        </div>
        <input
          type="submit"
          className="rounded-full bg-blue-500 
          text-white py-2.5 px-2.5 w-40 font-bold hover:bg-sky-700 cursor-pointer"
          value="Log in"
        />
      </form>
      <div className="separator">
        <div className="line" />
        <h5
          className="font-bold flex items-center
         justify-center bg-slate-200"
        >
          or
        </h5>
        <div className="line" />
      </div>

      <GoogleButton className="google_btn" onClick={handleLoginGoogle} />

      <h5>
        Don't Have you account?
        <Link
          to={"/auth/register"}
          className="signin_btn mx-1 text-blue-500 font-bold"
        >
          Register
        </Link>
      </h5>
    </div>
  );
};

export default Login;
