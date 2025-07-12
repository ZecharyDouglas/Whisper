import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./helper/AuthContext";
import { GETUSERFRIENDS, SENDMESSAGE, GET_USERS } from "./graphql/gqueries";
import { Link, Outlet } from "react-router";

export default function DashBoard() {
  const { logout, user } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    setTimeout(() => {
      logout();
      alert("Logged Out Successfully!");
      navigate("/login");
    }, 2000);
  };

  return (
    // Navbar Component
    <div className=" h-full w-full">
      <div>
        <div className="navbar bg-base-100 shadow-sm">
          <div className="flex-1">
            <a className="btn btn-ghost text-3xl">
              <Link to="/dashboard">Whisper</Link>
            </a>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
            />
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/dashboard/profile">Profile</Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
