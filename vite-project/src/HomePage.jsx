import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./helper/AuthContext";
import { useApolloClient, useQuery } from "@apollo/client";
import { useMutation, useSubscription } from "@apollo/client";
import { GETUSERFRIENDS, SENDMESSAGE, GET_USERS } from "./graphql/gqueries";
import ChatModal from "./ChatModal";
import { Link } from "react-router";
import Profile from "./Profile";

export default function HomePage() {
  const { logout, user } = useAuth();
  const [chatMessage, setchatMessage] = useState("");
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);
  //sendMessage mutation to send message
  const [sendMessage] = useMutation(SENDMESSAGE);

  //get user friends query to ge the friends and relationship ids
  const {
    data: friendsData,
    error: friendsError,
    loading: friendsLoading,
  } = useQuery(GETUSERFRIENDS, {
    variables: { user_id: user.id },
  });
  //getting all the users to compare against the friends for the discover section
  const {
    data: allUsers,
    error: allUsersError,
    loading: usersLoading,
  } = useQuery(GET_USERS);

  useEffect(() => {
    if (friendsData?.currentUserFriends) {
      console.log(friendsData.currentUserFriends);
      setFriends(friendsData.currentUserFriends);
    }
    if (allUsers?.getUsers) {
      console.log(allUsers.getUsers);
      setUsers(allUsers.getUsers);
    }
  }, [friendsData, allUsers]);

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
            <a className="btn btn-ghost text-3xl">Whisper</a>
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
                  <Link to="/profile">Profile</Link>
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
      </div>
      {!friends ? (
        <div className="flex h-full w-full">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      ) : (
        <div className=" grid grid-cols-4 mt-5 h-auto w-full">
          <div className="col-span-1 bg-base-300">
            <div className="flex flex-col">
              <h1 className=" text-5xl text-center mb-5">Your Friends</h1>
              {/* render friends components here */}
              {friends.map((friend, i) => (
                <div className="grid grid-cols-4">
                  <div
                    className=" btn my-3 mx-3 text-center col-span-3"
                    key={i}
                  >
                    <button
                      className="btn btn-ghost w-full"
                      key={i}
                      onClick={() =>
                        document.getElementById(`my_modal_${i}`).showModal()
                      }
                    >
                      {/* beginning of the modal box */}
                      <dialog id={`my_modal_${i}`} className="modal ">
                        <div className="modal-box h-2/5 w-2/5 fixed bottom-5 right-5  ">
                          <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                              ✕
                            </button>
                          </form>
                          <h3 className="font-bold text-lg">
                            {friend.username}
                          </h3>
                          {/* beginning of chat component */}
                          <ChatModal friend={friend} />
                          {/* end of the chat component */}
                          <textarea
                            className="textarea w-full mt-30"
                            placeholder="Send a message"
                            value={chatMessage}
                            onChange={(e) => {
                              setchatMessage(e.target.value);
                            }}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                try {
                                  const response = await sendMessage({
                                    variables: {
                                      user_id: user.id,
                                      relationship_id: friend.relationship_id,
                                      message: chatMessage,
                                    },
                                  });
                                  if (response?.data?.sendMessage) {
                                    console.log(response?.data?.sendMessage);
                                    setchatMessage("");
                                  }
                                } catch (error) {
                                  console.log("Error sending message: ", error);
                                }
                              }
                            }}
                          ></textarea>
                        </div>
                      </dialog>
                      <h2>{friend.username}</h2>
                      {/* end of the modal box */}
                    </button>
                  </div>
                  <div className=" col-span-1">
                    <button className="btn btn-soft btn-error my-3 place-items-center">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className=" col-span-3 bg-base-200 flex flex-col items-center">
            <div className=" w-full">
              <h3 className=" text-center text-5xl">Discover</h3>
            </div>
            {/* render discovery cards here */}
            <div className=" grid grid-cols-3 place-items-center w-full p-5">
              {users.map((user, i) => (
                <div className="card bg-base-100 w-70 shadow-sm m-2">
                  <figure>
                    <img
                      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                      alt="Shoes"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">
                      {/* name should go here */}
                      {user.username}
                      <div className="badge badge-secondary">NEW</div>
                    </h2>

                    <div className="card-actions justify-end">
                      <div className="badge badge-outline btn">Add</div>
                      <div className="badge badge-outline btn">Remove</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
