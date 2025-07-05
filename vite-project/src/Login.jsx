import React from "react";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "./graphql/gqueries";
import { useNavigate } from "react-router";
import { useAuth } from "./helper/AuthContext";

export default function Login() {
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });
  const [loginUser, { data, loading, error }] = useMutation(LOGIN);
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleCreateAccount = () => {
    navigate("/createaccount");
  };
  return (
    <div className=" h-1/2 w-full ">
      {/* login card parent */}
      <div className="flex flex-row h-screen w-screen justify-center items-center">
        {/* end of the login card box */}
        <div className=" flex items-center justify-center h-1/2 w-1/2 bg-base-200">
          <div className="flex flex-col items-center justify-center p-10 w-full">
            <h3 className=" text-white mb-10 text-center text-5xl">
              Welcome to Whisper
            </h3>
            <label className="input validator rounded-md w-2/3">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input
                type="text"
                required
                className="w-full"
                placeholder="Email"
                pattern="[A-Za-z][A-Za-z0-9\-]*"
                minlength="3"
                maxlength="30"
                title="Only letters, numbers or dash"
                value={formdata.email}
                onChange={(e) => {
                  setformdata((prev) => ({ ...prev, email: e.target.value }));
                }}
              />
            </label>
            <label className="input validator mt-5 rounded-md w-2/3">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle
                    cx="16.5"
                    cy="7.5"
                    r=".5"
                    fill="currentColor"
                  ></circle>
                </g>
              </svg>
              <input
                type="password"
                required
                placeholder="Password"
                // minlength="8"
                // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                // title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                value={formdata.password}
                onChange={(e) => {
                  setformdata((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
              />
            </label>
            <p className="validator-hint hidden">
              Must be more than 8 characters, including
              <br />
              At least one number <br />
              At least one lowercase letter <br />
              At least one uppercase letter
            </p>
            <button
              className="btn p-3 bg-base-300 mt-5 rounded-md w-2/3"
              onClick={async () => {
                try {
                  const response = await loginUser({
                    variables: {
                      email: formdata.email.toLowerCase(),
                      password: formdata.password,
                    },
                  });
                  console.log(response);
                  //localStorage.setItem("token", response.data.login.token);
                  login({
                    token: response.data.login.token,
                    user: response.data.login.user,
                  });
                  setTimeout(() => {
                    alert("Logged in Successfully.");
                    navigate("/homepage");
                  }, 3000);
                } catch (error) {
                  console.error("There was an error signing in user: ", error);
                }
              }}
            >
              Log In
            </button>
            <button
              className="btn p-3 bg-base-300 mt-5 mb-5 rounded-md w-2/3"
              onClick={handleCreateAccount}
            >
              Create An Account
            </button>
          </div>
        </div>
        {/* end of the login card box */}
      </div>
    </div>
  );
}
