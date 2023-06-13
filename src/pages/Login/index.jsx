import React, { useState } from "react";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { TITLE_ID, URL, URL_SERVER, XSecretKey } from "../../utils/constants";
import Loader from "../../components/Loader";

function Login() {
  const { auth, setAuth } = useAuth();

  const [inputValue, setInputValue] = React.useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(
        "https://titleId.playfabapi.com/Client/LoginWithEmailAddress",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "X-SecretKey": XSecretKey,
          },
          body: JSON.stringify({
            Email: inputValue.email,
            Password: inputValue.password,
            TitleId: TITLE_ID,
          }),
        }
      );
      const data = await res.json();
      setIsLoading(false);
      if (
        data.errorMessage === "User not found" ||
        data.errorMessage === "Invalid input parameters"
      ) {
        alert("Please check email and password");
      }
      if (res.ok) {
        setAuth(data.data);
        navigate("/");
      }
    } catch (err) {
      setIsLoading(false);
      alert("Something went wrong. Try again later");
    }
  };

  return (
    <form id="login-form" className="login-form" onSubmit={handleSubmit}>
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <p id="login-error" className="login-error"></p>
        <div className="login-subcontainer">
          <div className="login-innercontainer">
            <label className="login-label" htmlFor="email">
              Email
            </label>
            <div className="login-inputcontainer">
              <input
                type="email"
                name="email"
                id="email"
                className="login-input"
                onChange={handleInputChange}
              />
            </div>
            <span
              id="login-email-error"
              className="login-error login-input-error"
            ></span>
          </div>
          <div className="login-innercontainer">
            <label className="login-label" htmlFor="password">
              Password
            </label>
            <div className="login-inputcontainer">
              <input
                type="password"
                name="password"
                id="password"
                className="login-input login-password"
                onChange={handleInputChange}
              />
            </div>
            <span
              id="login-password-error"
              className="login-error login-input-error"
            ></span>
          </div>
        </div>
        <div className="login-buttoncontainer">
          <button className="login-button">LOGIN</button>
        </div>
        <p className="login-link_signup">
          <Link to="/signup">Create New Account</Link>
        </p>
      </div>
      {isLoading && (
        <div className="login-container_loader">
          <Loader />
        </div>
      )}
    </form>
  );
}

export default Login;
