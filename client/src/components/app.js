import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [state, setState] = useState({});
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get("http://localhost:3000/api/wallet-info");
      console.log(response.data);
      setState(response.data);
    };
    getData();
  }, []);

  return (
    <div>
      <h1>wallet info:</h1>
      <h3>Address: {state.address}</h3>
      <h3>Balance: {state.balance}</h3>
    </div>
  );
}
export default App;
