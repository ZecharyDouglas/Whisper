import React from "react";

export default function Profile() {
  return (
    <div className=" h-screen w-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center rounded-3xl bg-base-200 h-2/3 w-2/3 shadow-lg">
        <div className="flex flex-col mt-20 justify-center w-2/3 rounded-md">
          <div>
            <h1>Change your profile information</h1>
            <h1>
              Edit your contact and display information here. Some of these
              fields will change how you appear to other users{" "}
            </h1>
          </div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Change Name</legend>
            <input
              type="text"
              className="input w-200"
              placeholder="Enter your new name."
            />
            <p className="label">Optional</p>
          </fieldset>
        </div>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Change Email</legend>
          <input
            type="text"
            className="input w-200"
            placeholder="Enter your new email"
          />
          <p className="label">Optional</p>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Change Password</legend>
          <input
            type="password"
            className="input w-200"
            placeholder="Enter password."
          />
          <p className="label">Optional</p>
        </fieldset>

        <fieldset className="fieldset ml-0">
          <legend className="fieldset-legend">Change Avatar</legend>
          <input type="file" className="file-input w-200" />
          <p className="label">Optional</p>
        </fieldset>
        <button className="btn btn-active btn-primary mt-5">
          Submit Changes
        </button>
      </div>
    </div>
  );
}
