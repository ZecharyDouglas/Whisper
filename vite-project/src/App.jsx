import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useQuery, gql } from "@apollo/client";
function App() {
  const { data, loading, error } = useQuery(USERS);
  data ? console.log(data) : console.error(error);
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Fetch Names from DynamoDb</h1>
      <div>
        {!data ? (
          <p>Loading....</p>
        ) : (
          data?.getUsers?.map((user, i) => <h1 key={i}>{user}</h1>)
        )}
      </div>
    </>
  );
}

export default App;
