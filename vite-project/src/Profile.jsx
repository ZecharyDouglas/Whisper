import React from "react";
import { useState } from "react";

export default function Profile() {
  //remember its always best to initialize form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    file: null,
  });

  const handleChange = (e) => {
    //getting the name and value off the event object
    const { name, type, value, files } = e.target;
    //using the spread operator to copy the current version of the piece of state then replacing the field with the change's "name" with the new data
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault;
    console.log(formData);
  };
  return (
    <div className=" h-screen w-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center rounded-4xl p-20 bg-base-200 border border-white border-2 h-auto w-auto shadow-lg">
        <div className="flex flex-col">
          <div className=" w-full">
            <h1 className="text-3xl mb-2">Change your profile information</h1>
            <h1>
              Edit your contact and display information here. Some of these
              fields will change how you appear to other users{" "}
            </h1>
          </div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Change Name</legend>
            <input
              type="text"
              name="name"
              className="input w-full"
              placeholder="Enter your new name."
              value={formData.name}
              onChange={handleChange}
            />
            <p className="label">Optional</p>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Change Email</legend>
            <input
              type="text"
              name="email"
              className="input w-full"
              placeholder="Enter your new email"
              value={formData.email}
              onChange={handleChange}
            />
            <p className="label">Optional</p>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Change Password</legend>
            <input
              type="password"
              className="input w-full"
              placeholder="Enter password."
              value={formData.password}
              onChange={handleChange}
            />
            <p className="label">Optional</p>
          </fieldset>

          <fieldset className="fieldset ml-0">
            <legend className="fieldset-legend">Change Avatar</legend>
            <input
              type="file"
              name="file"
              className="file-input w-full"
              onChange={handleChange}
            />
            <p className="label">Optional</p>
          </fieldset>
          <button
            className="btn btn-active btn-primary mt-5"
            onClick={handleSubmit}
          >
            Submit Changes
          </button>
        </div>
      </div>
    </div>
  );
}
