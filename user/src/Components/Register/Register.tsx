import "./Register.css";

import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [errorShow, setErrorShow] = useState({
    errorEmail: "",
    errorPassword: "",
    errorFullname: "",
    errorUsername: "",
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorShow({
      ...errorShow,
      ["error" +
      e.target.name.charAt(0).toUpperCase() +
      e.target.name.slice(1)]: "",
    });
  };
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    let hasError = false;
    if (formData.fullname.length < 6) {
      setErrorShow((prevErrors) => ({
        ...prevErrors,
        errorFullname: "Fullname must be at least 6 characters",
      }));
      hasError = true;
    }
    if (formData.username.length < 6) {
      setErrorShow((prevErrors) => ({
        ...prevErrors,
        errorUsername: "Username must be at least 6 characters",
      }));
      hasError = true;
    }
    if (formData.email.length == 0) {
      setErrorShow((prevErrors) => ({
        ...prevErrors,
        errorEmail: "Email must be at least 6 characters",
      }));
      hasError = true;
    }
    if (formData.password.length < 8) {
      setErrorShow((prevErrors) => ({
        ...prevErrors,
        errorPassword: "Password must be at least 8 characters",
      }));
      hasError = true;
    }

    if (hasError) return;
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users",
        formData
      );
      console.log("register response", response);

      window.location.href = "/";
    } catch (error: any) {
      // Ví dụ: hiển thị thông báo lỗi từ server
      console.log(error);
      setErrorShow((prev) => ({
        ...prev,
        errorEmail: error.response.data.message,
      }));
    }
  };

  return (
    <div className="register border-blue-500 border">
      <div className="register-top">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="r-k200y r-1cvl2hr r-4qtqp9 r-yyyyoo r-5sfk15 r-dnmrzs
           r-kzbkwu r-bnwqim r-1plcrui r-lrvibr fill-blue-500"
        >
          <g>
            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
          </g>
        </svg>
      </div>
      <h3 className="font-bold text-blue-500 text-xl">REGISTER TWITTER NOW</h3>
      <form
        className="register-form"
        method="post"
        action="#"
        onSubmit={handleRegister}
      >
        <div className="form-group">
          <input
            type="text"
            id="reg-fullname"
            name="fullname"
            onChange={handleInput}
            value={formData.fullname}
          />
          <label htmlFor="reg-fullname">
            Fullname <sup className="text-danger">*</sup>
          </label>
          <p className="text-red-500 error">{errorShow.errorFullname}</p>
        </div>
        <div className="form-group">
          <input
            type="text"
            id="reg-username"
            name="username"
            onChange={handleInput}
            value={formData.username}
          />
          <label htmlFor="reg-username">
            Username <sup className="text-danger">*</sup>
          </label>
          <p className="text-red-500  fw-bold error">
            {errorShow.errorUsername}
          </p>
        </div>
        <div className="form-group">
          <input
            type="email"
            id="reg-email"
            name="email"
            onChange={handleInput}
            value={formData.email}
          />
          <label htmlFor="reg-email">
            Email <sup className="text-danger">*</sup>
          </label>
          <p className="text-red-500 fw-bold w-full error-email error">
            {errorShow.errorEmail}
          </p>
        </div>
        <div className="form-group">
          <input
            type="passwword"
            id="reg-password"
            name="password"
            onChange={handleInput}
            value={formData.password}
          />
          <label htmlFor="reg-password">
            Password <sup className="text-danger">*</sup>
          </label>
          <p className="text-red-500  error">{errorShow.errorPassword}</p>
        </div>
        <input
          type="submit"
          className="rounded-full bg-blue-500 
          text-white py-2.5 px-2.5 w-40 font-bold hover:bg-sky-700 cursor-pointer"
          value="Register"
        />
      </form>
      <div className="separator">
        <div className="line" />
        <h5
          className="font-bold flex items-center
          justify-center bg-slate-200 "
        >
          or
        </h5>
        <div className="line" />
      </div>

      <p>
        By signing up, you agree to the <Link to={"/"}>Terms of Service</Link>{" "}
        and <br />
        <Link to={"/"}>Privacy Policy</Link>, including{" "}
        <Link to={"/"}>Cookie Use</Link>.
      </p>
      <h5 className="">
        Already have an account?
        <Link
          to={"/auth/login"}
          className="signin_btn mx-1 text-blue-500 font-bold"
        >
          Log in
        </Link>
      </h5>
    </div>
  );
};

export default Register;
