import React from "react";
import { gql, useMutation } from "@apollo/client";
import { CREATE_ACCOUNT } from "./graphql/gqueries";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function CreateAccount() {
  const [createUser, { data, loading, error }] = useMutation(CREATE_ACCOUNT);

  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    phonenumber: "",
  });
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full h-full items-center mt-20">
      <div className=" flex flex-col w-1/2 h-1/2 bg-white items-center rounded-md">
        <h1 className=" text-5xl text-base-300 my-2">Create an Account</h1>
        <fieldset className="fieldset bg-base-100 border-base-300 rounded-box border p-10 mb-5">
          <legend className="fieldset-legend">Name</legend>
          <input
            type="text"
            className="input"
            placeholder="Your name here"
            value={formdata.name}
            onChange={(e) => {
              setformdata((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
          <p className="label">You can change this later on from settings</p>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="Email"
            onChange={(e) => {
              setformdata((prev) => ({ ...prev, email: e.target.value }));
            }}
          />

          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            onChange={(e) => {
              setformdata((prev) => ({ ...prev, password: e.target.value }));
            }}
          />
          <legend className="fieldset-legend">Phone Number</legend>
          <input
            type="phone"
            className="input"
            placeholder="Your phone number here"
            onChange={(e) =>
              setformdata((prev) => ({ ...prev, phonenumber: e.target.value }))
            }
          />
          <p className="label mb-2">Select an avatar and standout!</p>
          <input
            type="file"
            className="file-input file-input-ghost mt-1 mb-3"
          />
          <button
            className="btn btn-neutral mt-4"
            onClick={async () => {
              try {
                const response = await createUser({
                  variables: {
                    name: formdata.name,
                    password: formdata.password,
                    email: formdata.email.toLowerCase(),
                    phonenumber: formdata.phonenumber,
                  },
                });
                console.log(response.data);
              } catch (error) {
                console.log("Failed to create user: ", error);
              }
              console.log(data);
              setTimeout(() => {
                alert(
                  "Your account was created successfully, redirecting to log in page..."
                );
                navigate("/login");
              }, 3000);
            }}
          >
            Create Account
          </button>
          <button
            className=" btn btn-neutral mt-4"
            onClick={() => {
              navigate("/login");
            }}
          >
            Sign In
          </button>
        </fieldset>
      </div>
    </div>
  );
}
