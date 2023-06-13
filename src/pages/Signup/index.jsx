import React, { useState } from "react";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { URL, URL_SERVER, XSecretKey, TITLE_ID } from "../../utils/constants";
import Loader from "../../components/Loader";

function Signup() {
  const { setAuth } = useAuth();

  const [inputValue, setInputValue] = useState(null);
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
        "https://titleId.playfabapi.com/Client/RegisterPlayFabUser",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Email: inputValue.email,
            Password: inputValue.password,
            RequireBothUsernameAndEmail: false,
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
        navigate("/");
        setAuth(data);
      }
    } catch (err) {
      setIsLoading(false);
      alert("Something went wrong. Try again later");
    }
  };

  return (
    <form id="signup-form" className="signup-form" onSubmit={handleSubmit}>
      <div className="signup-container">
        <h2 className="signup-title">Signup</h2>
        <div id="signup-error" className="signup-error"></div>
        <div className="signup-subcontainer">
          <div className="signup-innercontainer">
            <label className="signup-label" htmlFor="email">
              Email
            </label>
            <div className="signup-inputcontainer">
              <input
                type="email"
                name="email"
                id="email"
                className="signup-input"
                onChange={handleInputChange}
              />
            </div>
            <span
              id="signup-email-error"
              className="signup-error signup-input-error"
            ></span>
          </div>
          <div className="signup-innercontainer">
            <label className="signup-label" htmlFor="password">
              Password
            </label>
            <div className="signup-inputcontainer">
              <input
                type="password"
                name="password"
                id="password"
                className="signup-input signup-password"
                onChange={handleInputChange}
              />
            </div>
            <span
              id="signup-password-error"
              className="signup-error signup-input-error"
            ></span>
          </div>
        </div>
        <div className="signup-buttoncontainer">
          <button className="signup-button">CREATE ACCOUNT</button>
        </div>
        <p className="signup-link_signup">
          <Link to="/login">Already have an account ?</Link>
        </p>
      </div>
      {isLoading && (
        <div className="signup-container_loader">
          <Loader />
        </div>
      )}
    </form>
  );
}

export default Signup;
